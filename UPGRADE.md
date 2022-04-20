# Upgrade from Nova v3

The `file` column was renamed to `filename`.  Publish and run migrations:

```shell
php artisan vendor:publish --tag=nova-ckeditor-migrations
php artisan migrate
```

Change the `$fillable` array in the Media model from `file` to `filename`:

```php
/**
 * Fillable Attributes.
 */
protected $fillable = [
    'filename', 'mime', 'size', 'hash', 'width', 'height', 'disk'
];
```

Change the url accessor to use `filename`:

```php
/**
 * Get the public Url.
 * @return string
 */
public function getUrlAttribute()
{
    return MediaStorage::make($this->attributes['disk'])->url($this->attributes['filename']);
}
```

Change the `$search` array in the Media Nova Resource from `file` to `filename`:

```php
/**
 * The columns that should be searched.
 * @var array
 */
public static $search = [
   'filename',
];
```

Change the `Filename` Text Field attribute name from `file` to `filename`:

```php
Text::make('Filename', 'filename')
    ->displayUsing(fn($file) => Str::limit($file, 20))
    ->exceptOnForms()
    ->sortable(),
```
