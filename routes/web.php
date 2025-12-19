<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RouteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware(['auth', 'verified'])->group(function () {

    
    Route::get('/dashboard', [RouteController::class, 'index'])
        ->name('dashboard');

    Route::put('/routes/{id}', [RouteController::class, 'update']); 

    
    Route::post('/routes', [RouteController::class, 'store'])
        ->name('routes.store');

    Route::delete('/routes/bulk', [RouteController::class, 'bulkDestroy'])
        ->name('routes.bulk-destroy');

    Route::delete('/routes/{route}', [RouteController::class, 'destroy'])
        ->name('routes.destroy');

    
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__.'/auth.php';
