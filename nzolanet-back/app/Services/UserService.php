<?php
namespace App\Services;

use App\DTOs\UpdateProfileDTO;
use App\Repositories\UserRepository;
use App\Models\User;
use Exception;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function searchUsers(string $query)
    {
        return $this->userRepository->search($query);
    }

    public function getUserProfile(int $id): User
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            throw new Exception("Utilizador não encontrado.");
        }
        return $user;
    }

    public function updateProfile(User $user, UpdateProfileDTO $dto): User
    {
        return $this->userRepository->update($user, [
            'nome' => $dto->nome,
            'foto_perfil' => $dto->foto_perfil,
            'privacidade' => $dto->privacidade,
        ]);
    }

    public function followUser(User $user, int $targetUserId): void
    {
        if ($user->id === $targetUserId) {
            throw new Exception("Não podes seguir-te a ti próprio.");
        }
        $this->userRepository->follow($user, $targetUserId);
    }

    public function unfollowUser(User $user, int $targetUserId): void
    {
        $this->userRepository->unfollow($user, $targetUserId);
    }

    public function promoteService(int $targetUserId): void
    {
        $this->userRepository->promoteRepository($targetUserId);
    }

    public function destroyService(User $user): void 
    {
        $this->userRepository->deleteUser($user);
    }
}