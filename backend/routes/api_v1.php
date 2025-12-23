<?php

use Carbon\Month;
use App\Models\Months;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\V1\MonthsController;
use App\Http\Controllers\Api\V1\UserSettingsController;

//Route::middleware('auth:sanctum')->apiResource('months', Months::class);

Route::middleware('auth:sanctum')->get('/months', [MonthsController::class, 'index']);
Route::middleware('auth:sanctum')->get('/months/{months}', [MonthsController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-settings', [UserSettingsController::class, 'show']);
    Route::post('/user-settings', [UserSettingsController::class, 'store']);
    Route::put('/user-settings', [UserSettingsController::class, 'update']);
});
