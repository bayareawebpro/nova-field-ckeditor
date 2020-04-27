<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Fields\Field;

class CkEditor extends Field
{
    /**
     * The field's component.
     * @var string
     */
    public $component = 'ckeditor';

    /**
     * The meta data for the element.
     * @var array
     */
    public $meta = [
        'mediaBrowser' => false,
        'linkBrowser' => false,
    ];

    /**
     * Enable Media Browser
     * @param bool $enabled
     * @return $this
     */
    public function mediaBrowser($enabled = true): self
    {
        $this->meta['mediaBrowser'] = $enabled;
        return $this;
    }

    /**
     * Enable Link Browser
     * @param bool $enabled
     * @return $this
     */
    public function linkBrowser($enabled = true): self
    {
        $this->meta['linkBrowser'] = $enabled;
        return $this;
    }
}
