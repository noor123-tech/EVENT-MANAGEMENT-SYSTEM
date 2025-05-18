<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;

class Authenticate extends Middleware
{
    // No need for redirectTo since we are using API
    public function handle($request, Closure $next, ...$guards)
    {
        // If the request is for API (expects JSON), handle it differently
        if ($request->expectsJson()) {
            if (auth()->check()) {
                return $next($request);
            }

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // If not JSON request (like web request), use normal authentication
        return parent::handle($request, $next, ...$guards);
    }
}
