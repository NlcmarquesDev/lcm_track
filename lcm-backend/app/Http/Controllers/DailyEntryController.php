<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyEntry;
use App\Models\Household;
use App\Models\MonthlySummary;
use Carbon\Carbon;

class DailyEntryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'household_id' => 'required|exists:households,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        $householdId = $request->household_id;
        
        // Check access
        if (!$request->user()->households()->where('household_id', $householdId)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $household = Household::find($householdId);
        $budget = $household->daily_budget;

        $month = $request->month;
        $year = $request->year;

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // If today is in this month, we only show up to today?
        // Let's generate all days of the month.
        $daysInMonth = $startDate->daysInMonth;
        
        $entries = DailyEntry::where('household_id', $householdId)
            ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->get()
            ->keyBy('date');

        $isClosed = MonthlySummary::where('household_id', $householdId)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        $result = [];
        $cumulative = 0;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $dateStr = $startDate->copy()->addDays($day - 1)->format('Y-m-d');
            $spent = 0;
            
            if (isset($entries[$dateStr])) {
                $spent = $entries[$dateStr]->amount;
            }

            $difference = $budget - $spent;
            $cumulative += $difference;

            $result[] = [
                'date' => $dateStr,
                'spent' => (float) $spent,
                'budget' => (float) $budget,
                'difference' => (float) $difference,
                'cumulative' => (float) $cumulative,
                'status' => $difference >= 0 ? 'green' : 'red'
            ];
        }

        return response()->json([
            'entries' => $result,
            'is_closed' => $isClosed,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'household_id' => 'required|exists:households,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ]);

        $householdId = $request->household_id;

        if (!$request->user()->households()->where('household_id', $householdId)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $date = Carbon::parse($request->date);

        // Prevent editing if month is closed
        $isClosed = MonthlySummary::where('household_id', $householdId)
            ->where('month', $date->month)
            ->where('year', $date->year)
            ->exists();

        if ($isClosed) {
            return response()->json(['message' => 'Month is closed and cannot be modified'], 403);
        }

        $entry = DailyEntry::updateOrCreate(
            ['household_id' => $householdId, 'date' => $date->format('Y-m-d')],
            ['amount' => $request->amount]
        );

        return response()->json($entry);
    }
}
