<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'meta_title',
        'meta_description',
        'meta_robots',
        'media_id',
    ];

    protected $appends = [
        'url'
    ];

    public function media(): HasOne
    {
        return $this->hasOne(Media::class);
    }

    public function getUrlAttribute()
    {
        return url($this->slug);
    }
}
