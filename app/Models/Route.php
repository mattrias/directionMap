<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'start_location',
        'end_location',
        'start_lat',
        'start_lng',
        'end_lat',
        'end_lng',
        'path_coordinates',
    ];

    protected $casts = [
        'start_lat' => 'float',
        'start_lng' => 'float',
        'end_lat' => 'float',
        'end_lng' => 'float',
        'path_coordinates' => 'array',
    ];

    /**
     * Get the user that owns the route
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}