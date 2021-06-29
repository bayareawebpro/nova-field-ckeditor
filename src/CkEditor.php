<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Fields\Expandable;
use Laravel\Nova\Fields\Field;

class CkEditor extends Field
{
    use Expandable;

    /**
     * The field's component.
     * @var string $component
     */
    public $component = 'ckeditor';

    /**
     * Indicates whether the media browser should be available.
     * @var bool $mediaBrowser
     */
    public bool $mediaBrowser = false;

    /**
     * Indicates whether the link browser should be available.
     * @var bool $linkBrowser
     */
    public bool $linkBrowser = false;

    /**
     * The snippets to be displayed in the snippet browser.
     * @var array
     */
    public array $snippets = [];

    /**
     * Enable Media Browser.
     * @param bool $enabled
     * @return $this
     */
    public function mediaBrowser(bool $enabled = true): self
    {
        $this->mediaBrowser = $enabled;

        return $this;
    }

    /**
     * Enable Link Browser.
     * @param bool $enabled
     * @return $this
     */
    public function linkBrowser(bool $enabled = true): self
    {
        $this->linkBrowser = $enabled;

        return $this;
    }

    /**
     * Enable Snippets Browser.
     * @param array $snippets
     * @return $this
     */
    public function snippets(array $snippets): self
    {
        $this->snippets = $snippets;

        return $this;
    }

    /**
     * Prepare the element for JSON serialization.
     * @return array
     */
    public function jsonSerialize(): array
    {
        return array_merge(parent::jsonSerialize(), [
            'mediaBrowser' => $this->mediaBrowser,
            'linkBrowser'  => $this->linkBrowser,
            'snippets'     => $this->snippets,
            'shouldShow'   => $this->shouldBeExpanded(),
        ]);
    }
}
