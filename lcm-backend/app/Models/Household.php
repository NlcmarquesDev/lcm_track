<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    protected $fillable = ['name', 'daily_budget'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function dailyEntries()
    {
        return $this->hasMany(DailyEntry::class);
    }

    public function monthlySummaries()
    {
        return $this->hasMany(MonthlySummary::class);
    }
}
