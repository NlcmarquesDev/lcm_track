<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyExpense>
 */
class DailyExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $budgetMonth = Months::factory()->create();

        $date = Carbon::create(
            $budgetMonth->year,
            $budgetMonth->month,
            rand(1, Carbon::create($budgetMonth->year, $budgetMonth->month)->daysInMonth)
        );

        return [
            'user_id' => $budgetMonth->user_id,
            'budget_month_id' => $budgetMonth->id,
            'expense_date' => $date,
            'amount' => $this->faker->randomFloat(2, 5, 120),
            'description' => $this->faker->sentence(3),
        ];
}
