<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserFeedController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ HomeController::class, 'index' ])->name('home');
Route::get('/articles/{slug}', [ HomeController::class, 'show' ])->name('articles.show');


Route::middleware([ 'auth', 'verified:verify-email' ])->group(function ()
{
    Route::get('/myfeed', [ UserFeedController::class, 'index' ])->name('myfeed.index');

    Route::get('/preferences', [ PreferenceController::class, 'index' ])->name('preferences.index');
    
    Route::post('/preferences/{type}', [ PreferenceController::class, 'store' ])->name('preferences.store');
    Route::delete('/preferences/{type}', [ PreferenceController::class, 'destroy' ])->name('preferences.destroy');

    Route::get('/profile', [ ProfileController::class, 'edit' ])->name('profile.edit');
    Route::patch('/profile', [ ProfileController::class, 'update' ])->name('profile.update');
});


require __DIR__ . '/auth.php';
