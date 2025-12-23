<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Currency;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserSetting>
 */
class UserSettingsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   protected $model = \App\Models\UserSettings::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'currency_id' => Currency::inRandomOrder()->first()->id
                 ?? Currency::factory()->create()->id,

            'month_start_day' => $this->faker->numberBetween(1, 15),
            'monthly_budget' => $this->faker->randomFloat(2, 800, 2500),
        ];
    }
}
