<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameMatchController;
use App\Http\Controllers\MatchTeamController;

Route::middleware('api')->group(function () {
    Route::apiResource('matches', GameMatchController::class);
    
Route::apiResource('match-teams', MatchTeamController::class);
});
