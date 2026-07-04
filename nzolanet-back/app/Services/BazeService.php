<?php

namespace App\Services;

use App\Models\Baze;
use App\Models\User;
use App\Repositories\BazeRepository;
use App\Repositories\PublicationRepository;
use App\Services\NotificationService;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class BazeService
{
    public function __construct(
        protected PublicationRepository $publicationRepository,
        protected BazeRepository $bazeRepository,
        protected NotificationService $notificationService
    ){}

    public function publicationLike(User $user, int $idPublicacao) : Baze
    {
        $publication = $this->publicationRepository->findById($idPublicacao);

        if (! $publication) {
            throw new Exception('Publicação não encontrada.');
        }

        $baze = $this->bazeRepository->findByPubIdAndUserId($user->id, $idPublicacao);

        if($baze){
            throw new \Exception('Você já deu like nesta publicação.');
        }

        $baze = $this->bazeRepository->create([
            'user_id' => $user->id,
            'publication_id' => $publication->id
        ]);

        $this->notificationService->notifyPublicationOwnerAboutLike($user, $publication);

        return $baze;
    }

    public function publicationRemoveLike(User $user, int $idPublicacao) : void
    {

        $baze = $this->bazeRepository->findByPubIdAndUserId($user->id, $idPublicacao);

        $this->bazeRepository->delete($baze);
    }

    public function getAllBazes() : Collection
    {
        return $this->bazeRepository->all();
    }
}

?>
