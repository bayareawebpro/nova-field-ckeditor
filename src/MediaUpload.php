<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Fields\Image;
use Laravel\Nova\Http\Requests\NovaRequest;

class MediaUpload extends Image
{
    /**
     * Create a new field.
     * @param  string  $name
     * @param  string  $disk
     * @return void
     */
    public function __construct(string $name, string $attribute, string $disk = 'public')
    {
        parent::__construct($name, $attribute, $disk, app('ckeditor-media-storage', compact('disk')));
        $this->deletable(NovaRequest::capture()->isCreateOrAttachRequest());
        $this->hideWhenUpdating();
        $this->prunable();
    }
}
