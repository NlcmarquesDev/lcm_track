<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
      Currency::insert([
    ['code'=>'EUR','name'=>'Euro','symbol'=>'€','active'=>true],
    ['code'=>'USD','name'=>'US Dollar','symbol'=>'$','active'=>true],
    ['code'=>'BRL','name'=>'Brazilian Real','symbol'=>'R$','active'=>true],
]);

}
}
