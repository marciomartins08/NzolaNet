<?php
namespace App\Repositories;

use App\Models\User;

class UserRepository
{
public function create(array $data): User
{
    return User::create($data);
}

public function findByEmail(string $email): ?User
{
    return User::where('email', $email)->first();
}

public function update(User $user, array $data): User
{
    $user->update(array_filter($data)); // array_filter ignora campos nulos
    return $user;
}

public function follow(User $user, int $targetUserId): void
{
    // O attach() insere na tabela pivot 'followers' sem duplicar se usares o syncWithoutDetaching
    $user->following()->syncWithoutDetaching([$targetUserId]);
}

public function unfollow(User $user, int $targetUserId): void
{
    // O detach() remove o registo da tabela pivot
    $user->following()->detach($targetUserId);
}
}