<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest; 
use App\DTOs\RegisterDTO;
use App\DTOs\LoginDTO;            
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $dto = RegisterDTO::fromRequest($request);

        $result = $this->authService->register($dto);

        return response()->json([
            'message' => 'Utilizador registado com sucesso!',
            'user' => $result['user'],
            'token' => $result['token']
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $dto = LoginDTO::fromRequest($request);

        $result = $this->authService->login($dto);

        return response()->json([
            'message' => 'Login efetuado com sucesso!',
            'user' => $result['user'],
            'token' => $result['token']
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
    
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessão terminada com sucesso!'
        ], 200);
    }
}
