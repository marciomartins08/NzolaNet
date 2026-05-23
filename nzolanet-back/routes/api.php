<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CommentController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);

    //Gestao de users
    Route::get('/profile', [UserController::class, 'show']);       
    Route::put('/profile', [UserController::class, 'update']);    
    Route::post('/users/{id}/follow', [UserController::class, 'follow']);    
    Route::delete('/users/{id}/unfollow', [UserController::class, 'unfollow']); 


    //Gestao de publicacoes
    Route::get('/publications', [PublicationController::class, 'index']);       
    Route::post('/publications', [PublicationController::class, 'store']);      
    Route::put('/publications/{id}', [PublicationController::class, 'update']);   
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']); 

    // Gestão de Comentários
    Route::get('/publications/{publicationId}/comments', [CommentController::class, 'index']); 
    Route::post('/publications/{publicationId}/comments', [CommentController::class, 'store']); 
    Route::put('/comments/{id}', [CommentController::class, 'update']);  
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});