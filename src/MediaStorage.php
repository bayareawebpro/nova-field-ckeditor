<?php declare(strict_types=1);

namespace BayAreaWebPro\NovaFieldCkEditor;

use Throwable;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;

use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

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
    public function __construct(string $disk = 'media')
    {
        $this->disk = $disk;
    }

    /**
     * Make Instance
     * @param string $disk
     * @return static
     */
    public static function make(string $disk = 'media'): self
    {
        return app('ckeditor-media-storage', compact('disk'));
    }

    /**
     * Save a new media file from the Nova request.
     * @param Request $request
     * @return array
     * @throws Throwable
     */
    public function __invoke(Request $request)
    {
        return $this->handleUpload($request->file('file'));
    }

    /**
     * Handle the File Upload
     * @param UploadedFile $file
     * @return array
     * @throws Throwable
     */
    public function handleUpload(UploadedFile $file): array
    {
        $attributes = $this->resize($file);

        $file->storePubliclyAs('', $attributes['file'], [
            'disk' => $this->disk,
        ]);

        return array_merge($attributes, [
            'disk' => $this->disk,
        ]);
    }

    /**
     * Perform Resize & Conversion Operations.
     * @param UploadedFile $file
     * @return array
     * @throws Throwable
     */
    protected function resize(UploadedFile $file): array
    {
        ini_set('memory_limit', config('nova-ckeditor.memory', '256M'));

        $maxWidth = config('nova-ckeditor.max_width', 1024);
        $maxHeight = config('nova-ckeditor.max_height', 768);

        $hash = $this->hashFileContents($file);
        $name = $this->makeTargetFilename($file);
        $filePath = $this->makeTargetFilePath($name);

        $image = $this->resizeImage($file, $maxWidth, $maxHeight)->save($filePath, config('nova-ckeditor.max_quality', 75));

        return [
            'hash' => $hash,
            'file' => $name,
            'mime' => $image->mime(),
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => $this->optimize($filePath),
        ];
    }

    /**
     * Perform Optimization Operations.
     * @param string $tempPath
     * @return int
     * @throws Throwable
     */
    public function optimize(string $tempPath): int
    {
        ImageOptimizer::optimize($tempPath);
        return filesize($tempPath);
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
     * @param UploadedFile $file
     * @return false|string
     */
    protected function hashFileContents(UploadedFile $file): string
    {
        return md5_file($file->getRealPath());
    }

    /**
     * @param UploadedFile $file
     * @return string
     */
    protected function makeTargetFilename(UploadedFile $file): string
    {
        return sprintf(
            "%s.%s",
            Str::slug(Str::limit(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), config('nova-ckeditor.max_filename_characters', 250), '')),
            $file->guessExtension()
        );
    }

    /**
     * @param UploadedFile $file
     * @param $maxWidth
     * @param $maxHeight
     * @return \Intervention\Image\Image
     */
    protected function resizeImage(UploadedFile $file, $maxWidth, $maxHeight): \Intervention\Image\Image
    {
        $image = Image::make($file->getRealPath());
        if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
            $image->resize($maxWidth, $maxHeight, function (Constraint $constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        return $image;
    }

    /**
     * Make target file path.
     * @param string $name
     * @return string
     */
    protected function makeTargetFilePath(string $name): string
    {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . $name;
    }
}
