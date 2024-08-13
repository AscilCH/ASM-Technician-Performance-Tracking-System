<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\PersonalAccessToken;

class AuthenticateToken
{
    public function handle($request, Closure $next)
    {
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        $tokenRecord = PersonalAccessToken::where('token', $token)->first();
        
        if (!$tokenRecord) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        Auth::loginUsingId($tokenRecord->user_id);

        return $next($request);
    }
}
