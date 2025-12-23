<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use App\Models\Months;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Months>
 */
class MonthsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

protected $model = Months::class;

    public function definition(): array
    {
        $date = Carbon::now()->subMonths(rand(0, 6));
        $daysInMonth = $date->daysInMonth;
        $monthlyBudget = $this->faker->randomFloat(2, 800, 2500);

        return [
            'user_id' => 1, // ou User::factory()
            'year' => $date->year,
            'month' => $date->month,
            'monthly_budget' => $monthlyBudget,
            'daily_budget' => round($monthlyBudget / $daysInMonth, 2),
            'is_closed' => false,
            'closed_at' => null,
        ];
    }

    // ✅ Método custom para gerar despesas
    public function withExpenses()
    {
        return $this->afterCreating(function (Months $month) {
            $daysInMonth = Carbon::create($month->year, $month->month)->daysInMonth;

            for ($day = 1; $day <= $daysInMonth; $day++) {
                if (rand(0, 100) < 70) {
                    \App\Models\DailyExpense::factory()
                        ->count(rand(1, 3))
                        ->create([
                            'user_id' => $month->user_id,
                            'budget_month_id' => $month->id,
                            'expense_date' => Carbon::create($month->year, $month->month, $day),
                        ]);
                }
            }
        });
    }
}
