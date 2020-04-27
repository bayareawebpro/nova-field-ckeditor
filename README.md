## CkEditor Field + Media

> Docs: https://ckeditor.com/docs

Snippets will only render CkEditor Elements.  Standard HTML or Figures (table, image, video).

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

```php
FeaturedMedia::make('Image','media_id')
    ->rules('nullable')
    ->stacked(),
```

#### Disk
```php
'media' => [
    'driver' => 'local',
    'root' => storage_path('app/public/media'),
    'url' => env('APP_URL').'/storage/media',
    //'url' => 'https://my.sfo2.cdn.digitaloceanspaces.com/media',
    'visibility' => 'public',
],
```

#### MediaStorage 

> Override the MediaStorage Service by binding your own extended version.

```php
use BayAreaWebPro\NovaFieldCkEditor\MediaStorage;
class MyMediaStorage extends MediaStorage{

}
$this->app->bind('ckeditor-media-storage', MyMediaStorage::class);
```
