<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyEntry;
use App\Models\Household;
use App\Models\MonthlySummary;
use Carbon\Carbon;

class DashboardController extends Controller
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

        $household = Household::find($householdId);
        $now = Carbon::now();

        // Current month data
        $currentMonth = $now->month;
        $currentYear = $now->year;
        $startDate = $now->copy()->startOfMonth();
        $endDate = $now->copy()->endOfDay();
        $daysInMonth = $startDate->daysInMonth;

        $totalBudget = $daysInMonth * $household->daily_budget;

        $totalSpentCurrentMonth = DailyEntry::where('household_id', $householdId)
            ->whereBetween('date', [$startDate->format('Y-m-d'), $now->format('Y-m-d')])
            ->sum('amount');

        $daysPassed = $now->day;
        $budgetSoFar = $daysPassed * $household->daily_budget;
        $remaining = $budgetSoFar - $totalSpentCurrentMonth;
        $percentageUsed = $budgetSoFar > 0 ? ($totalSpentCurrentMonth / $budgetSoFar) * 100 : 0;

        // Previous month summary
        $prevMonth = $now->copy()->subMonth();
        $prevSummary = MonthlySummary::where('household_id', $householdId)
            ->where('month', $prevMonth->month)
            ->where('year', $prevMonth->year)
            ->first();

        // If no summary, compute it dynamically
        if (!$prevSummary) {
            $prevStart = $prevMonth->copy()->startOfMonth();
            $prevEnd = $prevMonth->copy()->endOfMonth();
            $prevDays = $prevStart->daysInMonth;
            $prevBudget = $prevDays * $household->daily_budget;
            $prevSpent = DailyEntry::where('household_id', $householdId)
                ->whereBetween('date', [$prevStart->format('Y-m-d'), $prevEnd->format('Y-m-d')])
                ->sum('amount');
            $prevDiff = $prevBudget - $prevSpent;
            $prevPct = $prevBudget > 0 ? ($prevSpent / $prevBudget) * 100 : 0;

            $prevSummary = [
                'month' => $prevMonth->month,
                'year' => $prevMonth->year,
                'total_spent' => (float) $prevSpent,
                'total_budget' => (float) $prevBudget,
                'difference' => (float) $prevDiff,
                'percentage' => (float) $prevPct,
                'is_closed' => false,
            ];
        } else {
            $prevSummary = array_merge($prevSummary->toArray(), ['is_closed' => true]);
        }

        return response()->json([
            'current_month' => [
                'month' => $currentMonth,
                'year' => $currentYear,
                'total_spent' => (float) $totalSpentCurrentMonth,
                'total_budget' => (float) $totalBudget,
                'budget_so_far' => (float) $budgetSoFar,
                'remaining' => (float) $remaining,
                'percentage_used' => round((float) $percentageUsed, 2),
                'daily_budget' => (float) $household->daily_budget,
            ],
            'previous_month' => $prevSummary,
        ]);
    }
}
