<?php

namespace App\Models;

use Carbon\Month;
use Illuminate\Database\Eloquent\Model;

class DailyExpense extends Model
{
    protected $fillable = [
        'user_id',
        'budget_month_id',
        'expense_date',
        'amount',
        'description',
    ];

    protected $casts = [
        'expense_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function budgetMonth()
    {
        return $this->belongsTo(Month::class);
    }
}
