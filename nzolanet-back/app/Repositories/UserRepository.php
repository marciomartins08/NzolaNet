<?php
namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{

    public function mostPublications() : Collection
    {
        return User::withCount(['publications','followers'])
                ->having('publications_count', '>', 0)
                ->orderByDesc('publications_count')
                ->limit(4)
                ->get();
    }

    public function countPublicationsAndFollowers(): Collection
    {
        return User::withCount(['publications','followers'])
                ->get();
    }

    public function count() : int
    {
        return User::count();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }
    public function delete(User $user) : void
    {
        $user->delete();
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


public function promoteRepository(int $targetUserId): void
{
    $user = $this->findById($targetUserId);
    if ($user) {
        $user->role = 'admin';
        $user->save();
    }

}

public function unfollow(User $user, int $targetUserId): void
{
    $user->following()->detach($targetUserId);
}

public function deleteUser(User $user): void
{
    $user->delete();
    
}
}
