<?php namespace BayAreaWebPro\NovaFieldCkEditor;

use Laravel\Nova\Nova;
use Illuminate\Support\Facades\App;
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
        if(!$this->app->bound('ckeditor-media-storage')){
            $this->app->bind('ckeditor-media-storage', MediaStorage::class);
        }

        $this->publishes([
            __DIR__.'/../config/nova-ckeditor.php' => config_path('nova-ckeditor.php')
        ], 'config');

        $this->publishes([
            __DIR__.'/../stubs/views' => resource_path('views/ckeditor'),
            __DIR__.'/../stubs/migrations' => database_path('migrations'),
            __DIR__.'/../stubs/models/Page.stub' => app_path('Models/Page.php'),
            __DIR__.'/../stubs/models/Media.stub' => app_path('Models/Media.php'),
            __DIR__.'/../stubs/resources/Page.stub' => app_path('Nova/Page.php'),
            __DIR__.'/../stubs/resources/Media.stub' => app_path('Nova/Media.php'),
            __DIR__.'/../resources/sass/figures.sass' => resource_path('sass/figures.sass'),
            __DIR__.'/../resources/sass/blocks.sass' => resource_path('sass/blocks.sass'),
        ], 'nova-ckeditor-stubs');
    }

    /**
     * Bootstrap the field services.
     * @return void
     */
    public function boot()
    {
        Nova::serving(function (ServingNova $event) {

            Nova::provideToScript(['ckeditor' => config('nova-ckeditor', [])]);
            Nova::style('field-ckeditor', __DIR__.'/../dist/css/field.css');

            // Allow Hot Reloading
            if(App::environment('local') && file_exists(__DIR__.'/../dist/hot')){
                Nova::remoteScript('http://localhost:8080/js/field.js');
            }else{
                Nova::script('field-ckeditor', __DIR__.'/../dist/js/field.js');
            }
        });
    }
}
