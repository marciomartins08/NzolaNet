<?php
namespace App\Services;

use App\DTOs\UpdateProfileDTO;
use App\Repositories\UserRepository;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected NotificationService $notificationService
    ) {}

    public function getUsersWithPublications() : Collection
    {
        return $this->userRepository->mostPublications();
    }

    public function deleteUser(int $id) : void
    {
        $user = $this->userRepository->findById($id);
        $this->userRepository->delete($user);
    }

    public function getUsers() : Collection
    {
        return $this->userRepository->countPublicationsAndFollowers();
    }

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

    public function countUsers() : int
    {
        return $this->userRepository->count();
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

        $targetUser = $this->userRepository->findById($targetUserId);
        if ($targetUser) {
            $this->notificationService->notifyUserFollowed($user, $targetUser);
        }
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
