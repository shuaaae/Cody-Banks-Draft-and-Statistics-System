<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // ✅ ADD THIS LINE
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
<<<<<<< HEAD
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
        ]);
=======
        //
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
