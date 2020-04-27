<?php declare(strict_types=1);

namespace BayAreaWebPro\NovaFieldCkEditor;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
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
     * Maximum Image Size
     */
    static int $maxWidth = 1024;
    static int $maxHeight = 768;

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
        return app(static::class, compact('disk'));
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
            Str::slug(Str::limit(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),60, ''))
        );

        $file->storePubliclyAs('',$name, [
            'disk' => $this->disk,
        ]);

        return array_merge($attributes, [
            'file' => $name,
            'hash' => $hash,
        ]);
    }


    /**
     * Perform Resize & Conversion Operations.
     * @param string $path
     * @return array
     */
    protected function resize(string $path): array
    {
        ini_set('memory_limit', '256M');

        $image = Image::make($path);

        if (($image->width() > static::$maxWidth || $image->height() > static::$maxHeight)) {
            $image->fit(static::$maxWidth, static::$maxHeight, function (Constraint $constraint) {
                $constraint->upsize();
            });
        }

        $image->save($path, 75);

        return [
            'mime'   => $image->mime(),
            'width'  => $image->width(),
            'height' => $image->height(),
            'size'   => $this->optimize($path),
        ];
    }

    /**
     * Perform Optimization Operations.
     * @param string $path
     * @return int
     */
    protected function optimize(string $path): int
    {
        $binaryPath = config('image.optimizer_binary_path','/usr/local/bin');
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
        $optimizerChain->optimize($path, $path);
        return filesize($path);
    }
}
