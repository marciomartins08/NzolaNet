<?php
namespace App\Repositories;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

class PublicationRepository
{
    public function getAll(): Collection
    {
        return Publication::with(['user', 'comments'])->latest()->get();
    }

    public function findById(int $id): ?Publication
    {
        return Publication::find($id);
    }

    public function create(array $data): Publication
    {
        return Publication::create($data);
    }

    public function update(Publication $publication, array $data): Publication
    {
        $publication->update(array_filter($data)); // array_filter ignora campos nulos
        return $publication;
    }

    public function delete(Publication $publication): void
    {
        $publication->delete();
    }
}
