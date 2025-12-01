<?php

namespace Database\Seeders;

use App\Models\Months;
use App\Models\User;
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

        Months::factory()->count(4)->create([
            'user_id' => $admin->id,
        ]);

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $users = User::factory()->count(5)->create();


        foreach ($users as $user) {
            Months::factory()->count(3)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
