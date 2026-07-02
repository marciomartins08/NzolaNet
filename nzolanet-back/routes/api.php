<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BazeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UploadController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/comments/count', [CommentController::class, 'contar']);
Route::get('/users/count', [UserController::class, 'contar']);
Route::get('/publications/count', [PublicationController::class, 'contar']);
Route::get('/users/most', [UserController::class, 'most']);
Route::get('/users/show',[UserController::class, 'mostrar']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'showUser']);
    Route::get('/users/{id}/publications', [PublicationController::class, 'userPublications']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/follow', [UserController::class, 'follow']);
    Route::delete('/users/{id}/unfollow', [UserController::class, 'unfollow']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::middleware('check.admin')->group(function () {
        Route::put('/users/{id}/promote', [UserController::class, 'promote']);
    });

    Route::post('/publications', [PublicationController::class, 'store']);
    Route::put('/publications/{id}', [PublicationController::class, 'update']);
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);
    Route::delete('/publicationsany/{id}', [PublicationController::class, 'deletar']);
    Route::get('/publications', [PublicationController::class, 'index']);

    Route::get('/publications/{publicationId}/comments', [CommentController::class, 'index']);
    Route::post('/publications/{publicationId}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    Route::get('/comments/{id}', [CommentController::class, 'getComment']);
    Route::get('/comments', [CommentController::class, 'listar']);
    Route::delete('/comments/admin/{id}', [CommentController::class, 'deletar']);

    Route::post('/publications/{id}/like',[BazeController::class, 'store']);
    Route::delete('/publications/{id}/remove',[BazeController::class, 'destroy']);
    Route::get('/likes',[BazeController::class, 'index']);


    Route::post('/upload', [UploadController::class, 'upload']);

});
