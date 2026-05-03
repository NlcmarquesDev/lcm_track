<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MonthlySummary;
use App\Models\Household;
use App\Models\DailyEntry;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MonthlySummaryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'household_id' => 'required|exists:households,id',
        ]);

        $householdId = $request->household_id;

        if (!$request->user()->households()->where('household_id', $householdId)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $summaries = MonthlySummary::where('household_id', $householdId)
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json($summaries);
    }

    public function closeMonth(Request $request)
    {
        $request->validate([
            'household_id' => 'required|exists:households,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        $householdId = $request->household_id;

        if (!$request->user()->households()->where('household_id', $householdId)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $household = Household::find($householdId);
        $month = $request->month;
        $year = $request->year;

        // Check if already closed
        $exists = MonthlySummary::where('household_id', $householdId)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Month is already closed'], 400);
        }

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();
        $daysInMonth = $startDate->daysInMonth;

        $totalBudget = $daysInMonth * $household->daily_budget;
        
        $totalSpent = DailyEntry::where('household_id', $householdId)
            ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->sum('amount');

        $difference = $totalBudget - $totalSpent;
        $percentage = $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0;

        $summary = MonthlySummary::create([
            'household_id' => $householdId,
            'month' => $month,
            'year' => $year,
            'total_spent' => $totalSpent,
            'total_budget' => $totalBudget,
            'difference' => $difference,
            'percentage' => $percentage,
        ]);

        return response()->json($summary, 201);
    }
}
