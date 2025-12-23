<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserSettings extends Model
{
    //
    use HasFactory;
    //protect $table = 'user_settings';
    protected $fillable = [
        'user_id',
        'currency_id',
        'monthly_budget',
        'month_start_day',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
