<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Months extends Model
{
    /** @use HasFactory<\Database\Factories\MonthsFactory> */
    use HasFactory;

    protected $fillable = [
        'months',
        'user_id',
        'daily_budget'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
