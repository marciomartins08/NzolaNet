<?php
namespace App\Services;

use App\DTOs\PublicationDTO;
use App\Repositories\PublicationRepository;
use App\Models\Publication;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class PublicationService
{
    public function __construct(protected PublicationRepository $publicationRepository) {}

    public function getAllPublications(): Collection
    {
        return $this->publicationRepository->getAll();
    }

    public function getUserPublications(int $userId): Collection
    {
        return $this->publicationRepository->getByUserId($userId);
    }

    public function countPublications() : int
    {
        return $this->publicationRepository->count();
    }

    public function createPublication(User $user, PublicationDTO $dto): Publication
    {
        return $this->publicationRepository->create([
            'user_id' => $user->id,
            'texto' => $dto->texto,
            'imagem' => $dto->imagem,
            'video' => $dto->video,
        ]);
    }

    public function updatePublication(int $id, User $user, PublicationDTO $dto): Publication
    {
        $publication = $this->publicationRepository->findById($id);

        if (!$publication) {
            throw new Exception("Publicação não encontrada.");
        }

        if ($publication->user_id !== $user->id) {
            throw new Exception("Não tens permissão para editar esta publicação.");
        }

        return $this->publicationRepository->update($publication, [
            'texto' => $dto->texto,
            'imagem' => $dto->imagem,
            'video' => $dto->video,
        ]);
    }

    public function deletePublication(int $id, User $user): void
    {
        $publication = $this->publicationRepository->findById($id);

        if (!$publication) {
            throw new Exception("Publicação não encontrada.");
        }

        if ($publication->user_id !== $user->id) {
            throw new Exception("Não tens permissão para apagar esta publicação.");
        }

        $this->publicationRepository->delete($publication);
    }

    public function deletePublicationAny(int $id): void
    {
        $publication = $this->publicationRepository->findById($id);

        if (!$publication) {
            throw new Exception("Publicação não encontrada.");
        }
        $this->publicationRepository->delete($publication);
    }
}
