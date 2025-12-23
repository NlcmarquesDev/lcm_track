<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Months>
 */
class MonthFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $date = Carbon::now()->subMonths(rand(0, 6));
        $daysInMonth = $date->daysInMonth;
        $monthlyBudget = $this->faker->randomFloat(2, 800, 2500);

        return [
            'user_id' => User::factory(),
            'year' => $date->year,
            'month' => $date->month,
            'monthly_budget' => $monthlyBudget,
            'daily_budget' => round($monthlyBudget / $daysInMonth, 2),
            'is_closed' => false,
            'closed_at' => null,
        ];
    }
     public function closed()
    {
        return $this->state(fn () => [
            'is_closed' => true,
            'closed_at' => now(),
        ]);
    }
}
