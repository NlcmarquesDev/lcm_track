<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Months extends Model
{
    /** @use HasFactory<\Database\Factories\MonthsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'monthly_budget',
        'daily_budget',
        'is_closed',
        'closed_at',
    ];

    protected $casts = [
        'is_closed' => 'boolean',
        'closed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function expenses()
    {
        return $this->hasMany(DailyExpense::class);
    }

    // Total gasto no mês
    public function totalSpent()
    {
        return $this->expenses()->sum('amount');
    }
}
