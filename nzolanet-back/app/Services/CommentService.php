<?php
namespace App\Services;

use App\DTOs\CommentDTO;
use App\Models\Comment;
use App\Models\User;
use App\Repositories\CommentRepository;
use App\Repositories\PublicationRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class CommentService
{
    public function __construct(
        protected CommentRepository $commentRepository,
        protected PublicationRepository $publicationRepository
    ) {}

    public function getCommentsByPublication(int $publicationId): Collection
    {
        $publication = $this->publicationRepository->findById($publicationId);

        if (!$publication) {
            throw new Exception("Publicação não encontrada.");
        }

        return $this->commentRepository->getByPublicationId($publicationId);
    }

    public function getCommentById(int $id, User $user) : Comment
    {
        return $this->commentRepository->findById($id);

    }

    public function getAllComments() : Collection
    {
        return $this->commentRepository->getAll();
    }

    public function getCount()
    {
        return $this->commentRepository->count();
    }

    public function createComment(User $user, int $publicationId, CommentDTO $dto): Comment
    {
        $publication = $this->publicationRepository->findById($publicationId);

        if (!$publication) {
            throw new Exception("Publicação não encontrada.");
        }

        return $this->commentRepository->create([
            'user_id' => $user->id,
            'publication_id' => $publicationId,
            'texto' => $dto->texto,
        ]);
    }

    public function updateComment(int $id, User $user, CommentDTO $dto): Comment
    {
        $comment = $this->commentRepository->findById($id);

        if (!$comment) {
            throw new Exception("Comentário não encontrado.");
        }

        if ($comment->user_id !== $user->id) {
            throw new Exception("Não tens permissão para editar este comentário.");
        }

        return $this->commentRepository->update($comment, [
            'texto' => $dto->texto,
        ]);
    }

    public function deleteComment(int $id, User $user): void
    {
        $comment = $this->commentRepository->findById($id);

        if (!$comment) {
            throw new Exception("Comentário não encontrado.");
        }

        if ($comment->user_id !== $user->id) {
            throw new Exception("Não tens permissão para apagar este comentário.");
        }

        $this->commentRepository->delete($comment);
    }

    public function deleteCommentAdmin(int $id): void
    {
        $comment = $this->commentRepository->findById($id);

        if (!$comment) {
            throw new Exception("Comentário não encontrado.");
        }
        $this->commentRepository->delete($comment);
    }
}
