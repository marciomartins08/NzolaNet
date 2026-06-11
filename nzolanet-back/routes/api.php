<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UploadController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/publications', [PublicationController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::post('/users/{id}/follow', [UserController::class, 'follow']);
    Route::delete('/users/{id}/unfollow', [UserController::class, 'unfollow']);


    Route::post('/publications', [PublicationController::class, 'store']);
    Route::put('/publications/{id}', [PublicationController::class, 'update']);
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);

    Route::get('/publications/{publicationId}/comments', [CommentController::class, 'index']);
    Route::post('/publications/{publicationId}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);


    Route::post('/upload', [UploadController::class, 'upload']);

    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});
