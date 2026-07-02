<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\DTOs\UpdateProfileDTO;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function contar() : JsonResponse
    {
        return response()->json([
            'count' => $this->userService->countUsers(),
        ], 200);
    }

    public function most() : JsonResponse
    {
        $arr = $this->userService->getUsersWithPublications();

        return response()->json($arr,200);
    }

    public function mostrar() : JsonResponse
    {
        $arr = $this->userService->getUsers();
        return response()->json($arr,200);
    }
    public function destroy(Request $request, int $id) : JsonResponse
    {
        try{
            $this->userService->deleteUser($id);
            return response()->json(['message' => 'User deletado com sucesso'], 200);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage()],403);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $query = $request->query('search', '');
        $users = $this->userService->searchUsers($query);
        $currentUser = $request->user();
        foreach ($users as $user) {
            $user->is_following = $currentUser ? $currentUser->following()->where('users.id', $user->id)->exists() : false;
        }
        return response()->json($users);
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->loadCount(['publications', 'followers', 'following']);
        return response()->json($user);
    }

    public function showUser(Request $request, $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserProfile((int)$id);
            $user->loadCount(['publications', 'followers', 'following']);
            $currentUser = $request->user();
            $user->is_following = $currentUser ? $currentUser->following()->where('users.id', $user->id)->exists() : false;
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
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
