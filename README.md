# Laravel Nova - CkEditor v5 Field
Media, Links & Snippet Browsers (VueJS)

Includes custom written plugins for Media, Links & Snippet Modals.
Publishable stubs for out-of-the-box usage.  Build a blog with rich content editing in minutes.

**Fields Included:** 
- CkEditor Field
- FeaturedMedia Field
- MediaUpload Field

**Packages Included:** 
- Spatie Image Optimizer
- Intervention Image

### Installation
```shell script
composer require bayareawebpro/nova-field-ckeditor
php artisan vendor:publish --tag=config
```

### Publish Stubs: Models, Resources, Migrations, Views

> Review the included stubs to see the default implementation.
> https://github.com/bayareawebpro/nova-field-ckeditor/tree/master/stubs

```shell script
php artisan vendor:publish --tag=nova-ckeditor-stubs
```

### Editor Field Usage:
```php
CkEditor::make('Content')
    ->rules('required')
    ->hideFromIndex()
    ->mediaBrowser()
    ->linkBrowser()
    ->stacked()
    ->snippets([
        ['name' =>'Cool Snippet1', 'html'=> view('snippets.1')->render()],
        ['name' =>'Cool Snippet2', 'html'=> view('snippets.2')->render()],
        ['name' =>'Cool Snippet3', 'html'=> view('snippets.3')->render()],
    ]),
```

> Note: Snippets will only render CkEditor Elements.  
> Standard HTML or Figures (table, image, video), see included views.
> https://ckeditor.com/docs

### FeaturedMedia Field Usage:

```php
FeaturedMedia::make('Image','media_id')
    ->rules('nullable')
    ->sizeOnDetail(800, 600)
    ->sizeOnForms(600, 400)
    ->sizeOnIndex(100,100)
    ->stacked(),
```

#### Media Local Disk
```php
'media' => [
    'driver' => 'local',
    'root' => storage_path('app/public/media'),
    'url' => env('APP_URL').'/storage/media',
    'visibility' => 'public',
],
```

#### Media Cloud Disk
```php
'media' => [
    'driver' => 's3',
    'key' => env('SPACES_KEY'),
    'secret' => env('SPACES_SECRET'),
    'endpoint' => env('SPACES_ENDPOINT'),
    'region' => env('SPACES_REGION'),
    'bucket' => env('SPACES_BUCKET'),
    'root' => 'media',
    'url' => 'https://'.env('SPACES_BUCKET').'.'.env('SPACES_REGION').'.cdn.digitaloceanspaces.com/media',
    'options' => [ 'CacheControl' => 'max-age=31536000, public' ],
],
```

#### MediaStorage 

> Override the MediaStorage Service by binding your own extended version.

```php
use Illuminate\Http\Request;
use BayAreaWebPro\NovaFieldCkEditor\MediaStorage;
class MyMediaStorage extends MediaStorage
{
    public function __invoke(Request $request)
    {
        // TODO: Change the default implementation.
    }
}
$this->app->bind('ckeditor-media-storage', MyMediaStorage::class);
```
