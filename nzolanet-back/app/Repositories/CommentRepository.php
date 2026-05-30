<?php
namespace App\Repositories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Collection;

class CommentRepository
{
    public function getByPublicationId(int $publicationId): Collection
    {
        return Comment::with('user')
            ->where('publication_id', $publicationId)
            ->latest()
            ->get();
    }

    public function findById(int $id): ?Comment
    {
        return Comment::find($id);
    }

    public function create(array $data): Comment
    {
        return Comment::create($data);
    }

    public function update(Comment $comment, array $data): Comment
    {
        $comment->update(array_filter($data));
        return $comment;
    }

    public function delete(Comment $comment): void
    {
        $comment->delete();
    }
}
