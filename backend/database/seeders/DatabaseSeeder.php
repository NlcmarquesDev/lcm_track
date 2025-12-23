<?php

namespace Database\Seeders;


use App\Models\User;
use App\Models\UserSettings;
use App\Models\Months;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@lcmtrack.com',
            'password' => bcrypt('pass123'), // password fixa
        ]);

        User::factory()
        ->count(5)
        ->create()
        ->each(function ($user) {

            UserSettings::factory()->create([
                'user_id' => $user->id,
            ]);

            Months::factory()
                    //->withExpenses()
                    ->create([
                        'user_id' => $user->id,
                    ]);
        });

    }
}
