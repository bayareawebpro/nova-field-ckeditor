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
        return $this->withMeta([
            'mediaBrowser' => $enabled
        ]);
    }

    /**
     * Enable Link Browser
     * @param bool $enabled
     * @return $this
     */
    public function linkBrowser($enabled = true): self
    {
        return $this->withMeta([
            'linkBrowser' => $enabled
        ]);
    }

    /**
     * Enable Snippets Browser
     * @param array $snippets
     * @return $this
     */
    public function snippets(array $snippets): self
    {
        return $this->withMeta([
            'snippetBrowser' => $snippets
        ]);
    }
}
