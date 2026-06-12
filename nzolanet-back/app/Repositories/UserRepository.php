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

public function findById(int $id): ?User
{
    return User::find($id);
}

public function search(string $query)
{
    return User::where('nome', 'LIKE', "%{$query}%")->get();
}

public function update(User $user, array $data): User
{
    $user->update(array_filter($data)); 
    return $user;
}

public function follow(User $user, int $targetUserId): void
{
    $user->following()->syncWithoutDetaching([$targetUserId]);
}

public function unfollow(User $user, int $targetUserId): void
{
    $user->following()->detach($targetUserId);
}
}