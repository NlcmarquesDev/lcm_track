<?php

use App\Http\Controllers\Api\V1\MonthsController;
use App\Models\Months;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Carbon\Month;

//Route::middleware('auth:sanctum')->apiResource('months', Months::class);

Route::middleware('auth:sanctum')->get('/months', [MonthsController::class, 'index']);
Route::middleware('auth:sanctum')->get('/months/{months}', [MonthsController::class, 'show']);
