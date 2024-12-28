<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    /** @use HasFactory<\Database\Factories\UserPreferenceFactory> */
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'sources',
        'categories',
        'authors',
    ];

    protected $casts = [
        'sources'    => 'json',
        'categories' => 'json',
        'authors'    => 'json',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
