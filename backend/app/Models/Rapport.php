<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    //
    protected $fillable = [
        'period',
        'total_spend',
        'budget_month',
        'result_month',
    ];
}
