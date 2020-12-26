<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use BayAreaWebPro\NovaFieldCkEditor\MediaStorage;

class Media extends Model
{
    /**
     * Fillable Attributes.
     */
    protected $fillable = [
        'file', 'mime', 'size', 'hash', 'width', 'height', 'disk'
    ];

    /**
     * Get Pages Assigned to Model.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    /**
     * Get the public Url.
     * @return string
     */
    public function getUrlAttribute()
    {
        return MediaStorage::make($this->attributes['disk'])->url($this->attributes['file']);
    }

    /**
     * Get the formatted file size.
     * @return string
     */
    public function getSizeAttribute()
    {
        return MediaStorage::bytesForHumans($this->attributes['size']);
    }
}
