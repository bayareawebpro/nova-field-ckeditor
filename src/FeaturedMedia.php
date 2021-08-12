<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Fields\Field;

class FeaturedMedia extends Field
{
    /**
     * The field's component.
     * @var string
     */
    public $component = 'media';

    /**
     * The meta data for the element.
     * @var array
     */
    public $meta = [
        'index_width' => 100,
        'index_height' => 100,
        'form_width' => 800,
        'form_height' => 600,
        'detail_width' => 1600,
        'detail_height' => 1200,
    ];

    /**
     * Max Size on index page.
     * @param int $width
     * @param int $height
     * @return $this
     */
    public function sizeOnIndex(int $width,int $height): self
    {
        return $this->withMeta([
            'index_width' => $width,
            'index_height' => $height,
        ]);
    }

    /**
     * Max Size on detail pages.
     * @param int $width
     * @param int $height
     * @return $this
     */
    public function sizeOnDetail(int $width,int $height): self
    {
        return $this->withMeta([
            'detail_width' => $width,
            'detail_height' => $height,
        ]);
    }

    /**
     * Max Size on detail pages.
     * @param int $width
     * @param int $height
     * @return $this
     */
    public function sizeOnForms(int $width,int $height): self
    {
        return $this->withMeta([
            'form_width' => $width,
            'form_height' => $height,
        ]);
    }
}
