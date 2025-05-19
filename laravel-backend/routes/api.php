<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Admin Routes (Protected)
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
});

// Public Routes - Events listing, viewing, adding, updating, deleting without auth
Route::get('events', [EventController::class, 'index']);
Route::get('events/{id}', [EventController::class, 'show']);

// Now make store, update, delete public (no auth)
Route::post('events', [EventController::class, 'store']);
Route::put('events/{id}', [EventController::class, 'update']);
Route::delete('events/{id}', [EventController::class, 'destroy']);

// User Routes (Protected)
Route::middleware('auth:api')->group(function () {
    // User Profile
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Public Auth Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);