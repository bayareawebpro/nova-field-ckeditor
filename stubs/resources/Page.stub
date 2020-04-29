<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
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
    public static $model = \App\Page::class;

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
            ID::make()
                ->exceptOnForms()
                ->sortable(),

            Text::make('title')
                ->rules('required','string')
                ->stacked(),

            Text::make('slug')
                ->rules('required','string')
                ->hideFromIndex()
                ->stacked(),

            CkEditor::make('content')
                ->rules('nullable','string')
                ->mediaBrowser()
                ->linkBrowser()
                ->snippets([
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet1</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet2</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet3</h1>'],
                    ['name' =>'Cool Snippet', 'html'=> '<h1>Snippet4</h1>'],
                ])
                ->hideFromIndex()
                ->stacked(),

            CkEditor::make('excerpt')
                ->rules('nullable','string')
                ->mediaBrowser()
                ->linkBrowser()
                ->hideFromIndex()
                ->stacked(),

            FeaturedMedia::make('Image','media_id')
                ->rules('nullable','numeric','exists:media,id')
                ->stacked(),

            Text::make('Meta Title')
                ->rules('nullable','string'),

            Textarea::make('Meta Description')
                ->rules('nullable','string'),

            Select::make('Meta Robots')
                ->rules('required', 'string')
                ->displayUsingLabels()
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
