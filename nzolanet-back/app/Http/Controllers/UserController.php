<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\DTOs\UpdateProfileDTO;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->loadCount(['publications', 'followers', 'following']);
        return response()->json($user);
    }

    public function update(Request $request): JsonResponse
    {
        $dto = UpdateProfileDTO::fromRequest($request);
        $updatedUser = $this->userService->updateProfile($request->user(), $dto);

        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user' => $updatedUser
        ]);
    }

    public function follow(Request $request, $id): JsonResponse
    {
        try {
            $this->userService->followUser($request->user(), (int)$id);
            return response()->json(['message' => 'Agora estás a seguir este utilizador.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function unfollow(Request $request, $id): JsonResponse
    {
        $this->userService->unfollowUser($request->user(), (int)$id);
        return response()->json(['message' => 'Deixaste de seguir este utilizador.']);
    }
}
