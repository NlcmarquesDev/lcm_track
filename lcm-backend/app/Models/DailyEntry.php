<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyEntry extends Model
{
    protected $fillable = ['household_id', 'date', 'amount'];

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}
