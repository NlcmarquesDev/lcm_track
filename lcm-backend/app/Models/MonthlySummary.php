<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlySummary extends Model
{
    protected $fillable = ['household_id', 'month', 'year', 'total_spent', 'total_budget', 'difference', 'percentage'];

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}
