<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Nova;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\ServiceProvider;

class FieldServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap the field services.
     * @return void
     */
    public function boot()
    {
        Nova::serving(function (ServingNova $event) {
            Nova::provideToScript([
                'ckeditor' => config('nova-ckeditor', [
                    'media_route' => url('/nova-api/media'),
                    'links_route' => url('/nova-api/pages'),
                ])
            ]);
            if(App::environment('local') && file_exists(__DIR__.'/../dist/hot')){
                Nova::remoteScript('http://localhost:8080/js/field.js');
            }else{
                Nova::script('field-ckeditor', __DIR__.'/../dist/js/field.js');
            }
            Nova::style('field-ckeditor', __DIR__.'/../dist/css/field.css');
        });
    }
}
