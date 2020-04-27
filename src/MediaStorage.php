<?php declare(strict_types=1);

namespace BayAreaWebPro\NovaFieldCkEditor;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\ImageOptimizer\Optimizers\Gifsicle;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;
use Spatie\ImageOptimizer\Optimizers\Optipng;
use Spatie\ImageOptimizer\Optimizers\Pngquant;

use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;

class MediaStorage
{

    /**
     * Storage Disk
     */
    private string $disk;

    /**
     * MediaStorage constructor.
     * @param string $disk
     */
    public function __construct($disk = 'media')
    {
        $this->disk = $disk;
    }

    /**
     * @param string $disk
     * @return static
     */
    public static function make($disk = 'media'): self
    {
        return app('ckeditor-media-storage', compact('disk'));
    }

    /**
     * Get the URL for the media file.
     * @param string $file
     * @return mixed
     */
    public function url(string $file)
    {
        return Storage::disk($this->disk)->url($file);
    }

    /**
     * Save a new media file from the Nova request.
     * @param Request $request
     * @return array
     * @throws \Throwable
     */
    public function __invoke(Request $request)
    {
        return $this->handleUpload($request->file('file'));
    }

    /**
     * Handle the File Upload
     * @param UploadedFile $file
     * @return array
     */
    public function handleUpload(UploadedFile $file): array
    {
        $hash = md5_file($file->getRealPath());
        $attributes = $this->resize($file->getRealPath());

        $name = sprintf(
            "%s.{$file->guessExtension()}",
            Str::slug(Str::limit(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), 60, ''))
        );

        $file->storePubliclyAs('', $name, [
            'disk' => $this->disk,
        ]);

        return array_merge($attributes, [
            'disk' => $this->disk,
            'file' => $name,
            'hash' => $hash,
        ]);
    }


    /**
     * Perform Resize & Conversion Operations.
     * @param string $filePath
     * @return array
     */
    protected function resize(string $filePath): array
    {
        ini_set('memory_limit', config('nova-ckeditor.memory', '256M'));

        $maxWidth = config('nova-ckeditor.max_width', 1024);
        $maxHeight = config('nova-ckeditor.max_height', 768);

        $image = Image::make($filePath);

        if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
            $image->fit($maxWidth, $maxHeight, function (Constraint $constraint) {
                $constraint->upsize();
            });
        }
        $image->save($filePath, 75);

        dispatch(function() use ($filePath){
            $this->optimize($filePath);
        });
        return [
            'mime'   => $image->mime(),
            'width'  => $image->width(),
            'height' => $image->height(),
            'size'   => $image->filesize(),
        ];
    }

    /**
     * Perform Optimization Operations.
     * @param string $name
     * @throws \Throwable
     */
    public function optimize(string $name):void
    {
        $tempPath = storage_path("app/tmp/$name");

        $binaryPath = config('nova-ckeditor.bin_path', '/usr/local/bin');

        if(!Storage::writeStream($tempPath, Storage::disk($this->disk)->readStream($name))) return;

            $optimizerChain = (new OptimizerChain())
                ->addOptimizer(
                    with(new Jpegoptim([
                        '--max75',
                        '--strip-all',
                        '--all-progressive',
                        '--quiet',
                    ]))
                    ->setBinaryPath($binaryPath)
                )
                ->addOptimizer(
                    with(new Optipng([
                        '-i0',
                        '-o3',
                        '-quiet',
                    ]))
                    ->setBinaryPath($binaryPath)
                )
                ->addOptimizer(
                    with(new Pngquant([
                        '--force',
                        '--skip-if-larger',
                        '--quality=75',
                    ]))
                    ->setBinaryPath($binaryPath)
                )
                ->addOptimizer(
                    with(new Gifsicle([
                        '-b',
                        '-O3',
                    ]))
                    ->setBinaryPath($binaryPath)
                );

            $optimizerChain->useLogger(app('log'));
            $optimizerChain->optimize($tempPath, $tempPath);

            DB::table('media')->where('file', $name)->update([
                'size' => filesize($tempPath)
            ]);

            Storage::disk($this->disk)->putFileAs('', new UploadedFile($tempPath),$name);
            Storage::disk('local')->delete($tempPath);
    }

    /**
     * Get formatted bytes.
     * @param int $bytes
     * @return string
     */
    public static function bytesForHumans(int $bytes): string
    {
        $units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
