<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\DailyEntryController;
use App\Http\Controllers\MonthlySummaryController;
use App\Http\Controllers\DashboardController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('households', HouseholdController::class);
    Route::post('/households/{household}/invite', [HouseholdController::class, 'invite']);
    Route::delete('/households/{household}/members/{user}', [HouseholdController::class, 'removeMember']);
    Route::get('/households/{household}', [HouseholdController::class, 'show']);
    
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    Route::apiResource('entries', DailyEntryController::class)->except(['show', 'destroy']);
    Route::post('/months/close', [MonthlySummaryController::class, 'closeMonth']);
    Route::get('/reports', [MonthlySummaryController::class, 'index']);
});
