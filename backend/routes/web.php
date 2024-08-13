<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MissionController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\TechMissController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TechnicienController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\TechnicienAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

Route::options('{any}', function (Request $request) {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');

Route::prefix('api')->group(function () {

    // Technicien routes
    Route::get('/techniciens', [TechnicienController::class, 'index']);
    Route::post('/techniciens', [TechnicienController::class, 'store']);
    Route::get('/techniciens/{id}', [TechnicienController::class, 'show']);
    Route::put('/techniciens/{id}', [TechnicienController::class, 'update']);
    Route::delete('/techniciens/{id}', [TechnicienController::class, 'destroy']);

    // Reclamation routes
    Route::get('/reclamation', [ReclamationController::class, 'index']);
    Route::get('/reclamation/{id}', [ReclamationController::class, 'show']);
    Route::post('/reclamation', [ReclamationController::class, 'store']);
    Route::put('/reclamation/{id}', [ReclamationController::class, 'update']);
    Route::delete('/reclamation/{id}', [ReclamationController::class, 'destroy']);
    Route::get('techniciens/{id}/reclamations', [ReclamationController::class, 'getReclamationsByTechnician']);

    // Admin routes
    Route::get('/admins', [AdminController::class, 'index']);
    Route::get('/admins/{id}', [AdminController::class, 'show']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

    // Mission routes
    Route::get('/missions', [MissionController::class, 'index']);
    Route::get('/missions/{id}', [MissionController::class, 'show']);
    Route::post('/missions', [MissionController::class, 'store']);
    Route::put('/missions/{id}', [MissionController::class, 'update']);
    Route::delete('/missions/{id}', [MissionController::class, 'destroy']);
    Route::get('techniciens/{id}/missions', [MissionController::class, 'getMissionsByTechnician']);

    // TechMiss routes
    Route::get('/tech-misses', [TechMissController::class, 'index']);
    Route::get('/tech-misses/{id}', [TechMissController::class, 'show']);
    Route::post('/tech-misses', [TechMissController::class, 'store']);
    Route::put('/tech-misses/{id}', [TechMissController::class, 'update']);
    Route::delete('/tech-misses/{id}', [TechMissController::class, 'destroy']);

    // Clients routes
    Route::apiResource('clients', ClientController::class);

    // Admin auth routes
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AdminAuthController::class, 'me'])->middleware('auth:sanctum'); // Use 'auth:sanctum' middleware

    // Sending email routes
    Route::post('/send-email', [EmailController::class, 'sendEmail']);

    // Technicien auth routes
    Route::prefix('technicien')->group(function () {
        Route::post('login', [TechnicienAuthController::class, 'login']);
        Route::post('logout', [TechnicienAuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::post('register', [TechnicienAuthController::class, 'register']);
        Route::get('profile', [TechnicienAuthController::class, 'profile'])->middleware('auth:sanctum');
    });

    // Protected admin routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        // Define protected routes here
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Protected routes here
    });
});

// Add this route to handle file uploads
Route::post('/upload-photo', [TechnicienController::class, 'uploadPhoto']);

Route::get('/image/{filename}', function ($filename) {
    $path = public_path('image/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

// CORS Pre-flight requests
Route::options('{any}', function (Request $request) {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');
//send automatic mail to highest tech
Route::post('/send-email-to-highest', [EmailController::class, 'sendEmailToHighestScoringTech']);
