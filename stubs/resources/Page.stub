<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Textarea;
use BayAreaWebPro\NovaFieldCkEditor\CkEditor;
use BayAreaWebPro\NovaFieldCkEditor\FeaturedMedia;

class Page extends Resource
{
    /**
     * The model the resource corresponds to.
     * @var string
     */
    public static $model = \App\Models\Page::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     * @var string
     */
    public static $title = 'title';

    /**
     * The logical group associated with the resource.
     * @var string
     */
    public static $group = 'CMS';

    /**
     * The columns that should be searched.
     * @var array
     */
    public static $search = [
        'title',
        'content',
    ];

    /**
     * Get the fields displayed by the resource.
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [

            Text::make('Title')
                ->rules('required','string')
                ->stacked(),

            Slug::make('Slug')
                ->rules('required','string')
                ->stacked(),

            // The Url Attribute should be appended to the resource index
            // for editor requests if you want to control the link format.
            Text::make('Url')
                ->onlyOnIndex()
                ->hideFromIndex(!$request->has('ckeditor')),

            CkEditor::make('Content')
                ->rules('nullable','string')
                ->hideFromIndex()
                ->mediaBrowser()
                ->linkBrowser()
                ->snippets([
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet1</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet2</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet3</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet4</h1>'],
                ])
                ->stacked(),

            CkEditor::make('Excerpt')
                ->rules('nullable','string')
                ->hideFromIndex()
                ->mediaBrowser()
                ->linkBrowser()
                ->stacked(),

            FeaturedMedia::make('Image','media_id')
                ->rules('nullable','numeric','exists:media,id'),

            Text::make('Meta Title')
                ->rules('nullable','string')
                ->hideFromIndex(),

            Textarea::make('Meta Description')
                ->rules('nullable','string')
                ->hideFromIndex(),

            Select::make('Meta Robots')
                ->rules('required', 'string')
                ->displayUsingLabels()
                ->hideFromIndex()
                ->options([
                    'index,follow' => 'Index, Follow',
                    'index,nofollow' => 'Index, NoFollow',
                    'noindex,follow' => 'NoIndex, Follow',
                    'noindex,nofollow' => 'NoIndex, NoFollow',
                ]),
        ];
    }

    /**
     * Get the cards available for the request.
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
