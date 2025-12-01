<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
    public function definition(): array
    {
        return [
            'months' => $this->faker->date('Y-m'),
            'daily_budget' => $this->faker->randomFloat(2, 50, 200),
        ];
    }
}
