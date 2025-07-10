<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameMatchController;
use App\Http\Controllers\MatchTeamController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\PlayerController;

Route::middleware('api')->group(function () {
    Route::apiResource('matches', GameMatchController::class);
    
Route::apiResource('match-teams', MatchTeamController::class);
Route::get('/heroes', [HeroController::class, 'index']);
Route::post('/matches', [GameMatchController::class, 'store']);
Route::post('/teams/history', [App\Http\Controllers\Api\HeroController::class, 'storeTeamHistory']);
Route::get('/teams/history', [App\Http\Controllers\Api\HeroController::class, 'getTeamHistory']);
Route::post('/players/{player}/photo', [PlayerController::class, 'uploadPhoto']);
Route::post('/players/photo-by-name', [PlayerController::class, 'uploadPhotoByName']);
Route::get('/players/{playerName}/hero-stats', [PlayerController::class, 'heroStats']);
Route::get('/players/{playerName}/hero-stats-by-team', [PlayerController::class, 'heroStatsByTeam']);
Route::get('/players/{playerName}/hero-h2h-stats-by-team', [PlayerController::class, 'heroH2HStatsByTeam']);
Route::get('/players', [PlayerController::class, 'index']);
});
