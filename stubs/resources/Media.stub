<?php namespace App\Nova;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Nova\Fields\Text;
use BayAreaWebPro\NovaFieldCkEditor\MediaUpload;

class Media extends Resource
{
    /**
     * The model the resource corresponds to.
     * @var string
     */
    public static $model = \App\Models\Media::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     * @var string
     */
    public static $title = 'Media';

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
        'file',
    ];

    /**
     * Get the fields displayed by the resource.
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [

            MediaUpload::make('Preview', 'media')
                ->rules('required','mimes:jpg,jpeg,png,gif', 'max:5000')
                ->help('5MB Max FileSize.')
                ->maxWidth(800),

            Text::make('Filename', 'file')
                ->displayUsing(fn($file) => Str::limit($file, 20))
                ->sortable(),

            Text::make('Hash')
                ->onlyOnDetail()
                ->sortable(),

            Text::make('Mime')
                ->onlyOnDetail()
                ->sortable(),

            Text::make('Size')
                ->exceptOnForms()
                ->sortable(),

            Text::make('Width')
                ->exceptOnForms()
                ->sortable(),

            Text::make('Height')
                ->exceptOnForms()
                ->sortable(),
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

    /**
     * Get the search result subtitle for the resource.
     * @return string|null
     */
    public function subtitle()
    {
        return $this->resource->mime ?? '-';
    }

    /**
     * Get the displayable label of the resource.
     * @return string
     */
    public static function singularLabel()
    {
        return static::$title;
    }

    /**
     * Get the displayable label of the resource.
     * @return string
     */
    public static function label()
    {
        return static::$title;
    }

    /**
     * Determine if the current user can update the given resource.
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function authorizedToUpdate(Request $request)
    {
        return false;
    }
}
