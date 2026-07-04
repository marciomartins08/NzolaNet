<?php

namespace App\Services;

use App\Models\Publication;
use App\Models\User;
use App\Models\UserNotification;
use App\Repositories\UserNotificationRepository;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    public function __construct(protected UserNotificationRepository $notificationRepository) {}

    public function createForUser(int $recipientId, ?int $actorId, string $type, string $title, string $message, ?string $targetUrl = null, ?array $data = null): UserNotification
    {
        return $this->notificationRepository->create([
            'recipient_id' => $recipientId,
            'actor_id' => $actorId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'target_url' => $targetUrl,
            'data' => $data,
        ]);
    }

    public function notifyFollowersAboutPublication(User $publisher, Publication $publication): void
    {
        $publisher->followers()->get()->each(function (User $follower) use ($publisher, $publication) {
            $this->createForUser(
                $follower->id,
                $publisher->id,
                'publication',
                'Nova publicação',
                $publisher->nome . ' publicou algo novo.',
                '/feed',
                ['publication_id' => $publication->id]
            );
        });
    }

    public function notifyPublicationOwnerAboutLike(User $actor, Publication $publication): void
    {
        if ($publication->user_id === $actor->id) {
            return;
        }

        $this->createForUser(
            $publication->user_id,
            $actor->id,
            'like',
            'Nova curtida',
            $actor->nome . ' gostou da tua publicação.',
            '/feed',
            ['publication_id' => $publication->id]
        );
    }

    public function notifyPublicationOwnerAboutComment(User $actor, Publication $publication, int $commentId): void
    {
        if ($publication->user_id === $actor->id) {
            return;
        }

        $this->createForUser(
            $publication->user_id,
            $actor->id,
            'comment',
            'Novo comentário',
            $actor->nome . ' comentou na tua publicação.',
            '/feed',
            ['publication_id' => $publication->id, 'comment_id' => $commentId]
        );
    }

    public function notifyUserFollowed(User $actor, User $target): void
    {
        if ($actor->id === $target->id) {
            return;
        }

        $this->createForUser(
            $target->id,
            $actor->id,
            'follow',
            'Novo seguidor',
            $actor->nome . ' começou a seguir-te.',
            '/perfil/' . $actor->id,
            ['follower_id' => $actor->id]
        );
    }

    public function listForUser(User $user): Collection
    {
        return $this->notificationRepository->getForRecipient($user->id);
    }

    public function unreadCount(User $user): int
    {
        return $this->notificationRepository->unreadCount($user->id);
    }

    public function markAsRead(User $user, int $id): UserNotification
    {
        $notification = $this->notificationRepository->findByIdForRecipient($id, $user->id);

        if (! $notification) {
            throw new \Exception('Notificação não encontrada.');
        }

        return $this->notificationRepository->markAsRead($notification);
    }

    public function markAllAsRead(User $user): int
    {
        return $this->notificationRepository->markAllAsRead($user->id);
    }

    public function deleteForUser(User $user, int $id): void
    {
        $notification = $this->notificationRepository->findByIdForRecipient($id, $user->id);

        if (! $notification) {
            throw new \Exception('Notificação não encontrada.');
        }

        $this->notificationRepository->delete($notification);
    }
}