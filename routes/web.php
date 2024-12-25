<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserFeedController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ HomeController::class, 'index' ])->name('home');
Route::get('/articles/{slug}', [ HomeController::class, 'show' ])->name('articles.show');


Route::middleware([ 'auth', 'verified:verify-email' ])->group(function ()
{
    Route::get('/myfeed', [ UserFeedController::class, 'index' ])->name('myfeed');

    Route::get('/profile', [ ProfileController::class, 'edit' ])->name('profile.edit');
    Route::patch('/profile', [ ProfileController::class, 'update' ])->name('profile.update');
    Route::delete('/profile', [ ProfileController::class, 'destroy' ])->name('profile.destroy');
});


require __DIR__ . '/auth.php';
