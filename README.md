#### CKEditor
- https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/vuejs.html

### CkEditor Field Usage
```php
[
CkEditor::make('content')
    ->rules('required')
    ->mediaBrowser()
    ->linkBrowser()
    ->hideFromIndex()
    ->stacked(),
];
```

### Media Resource

Model Attributes: 
```php
[
    'file', 
    'mime',
    'size', 
    'hash',
    'width', 
    'height',
];
```

```php

use BayAreaWebPro\NovaFieldCkEditor\MediaUpload;

 return [
    MediaUpload::make('File', $disk = 'media')
        ->rules('mimes:jpg,jpeg,png,gif', 'max:5000')
        ->help('5MB Max FileSize.')
        ->maxWidth(800),
    Text::make('Filename', 'file')
        ->exceptOnForms()
        ->sortable(),
    Text::make('Mime')
        ->exceptOnForms()
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
```

### Page Model
```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    protected $fillable = [
        'title',
        'content',
    ];

    public function featured_media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }
}
```

### Media Model
```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use BayAreaWebPro\NovaFieldCkEditor\MediaStorage;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Media extends Model
{
    protected $fillable = [
        'file', 'mime',
        'size', 'hash',
        'width', 'height',
    ];

    /**
     * Get Pages Assigned to Model.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class, 'featured_media_id', 'id');
    }

    /**
     * Get the live Url
     * @return string
     */
    public function getUrlAttribute()
    {
        if(isset($this->attributes['file'])){
            return MediaStorage::make('media')->url($this->attributes['file']);
        }
    }

    /**
     * Get the formatted KB file size.
     * @return string
     */
    public function getSizeAttribute()
    {
        if (isset($this->attributes['size'])) {
            return number_format((int)$this->attributes['size'] / 1024, 2) . 'kb';
        }
    }
}
```



### Media Migration
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    /**
     * Run the migrations.
     * @return void
     */
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('mime')->index();
            $table->string('file')->index();
            $table->string('hash')->index();
            $table->unsignedInteger('width')->index();
            $table->unsignedInteger('height')->index();
            $table->unsignedInteger('size')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('media');
    }
}
```
