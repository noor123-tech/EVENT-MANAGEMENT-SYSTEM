<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// 🔒 Admin Routes (Protected)
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
});

// 🔒 User Routes (Protected)
Route::middleware('auth:api')->group(function () {
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{id}', [EventController::class, 'show']);
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{id}', [EventController::class, 'update']);
    Route::delete('events/{id}', [EventController::class, 'destroy']);
    
    // User Profile
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// 🔓 Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

