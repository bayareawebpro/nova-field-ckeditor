<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Page extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content',  'meta_title', 'meta_description','meta_robots', 'media_id',
    ];

    public function media(): HasOne
    {
        return $this->hasOne(Media::class);
    }
}
