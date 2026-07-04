<?php

namespace App\Repositories;

use App\Models\UserNotification;
use Illuminate\Database\Eloquent\Collection;

class UserNotificationRepository
{
    public function create(array $data): UserNotification
    {
        return UserNotification::create($data);
    }

    public function getForRecipient(int $recipientId): Collection
    {
        return UserNotification::with(['actor', 'recipient'])
            ->where('recipient_id', $recipientId)
            ->latest()
            ->get();
    }

    public function findByIdForRecipient(int $id, int $recipientId): ?UserNotification
    {
        return UserNotification::where('id', $id)
            ->where('recipient_id', $recipientId)
            ->first();
    }

    public function unreadCount(int $recipientId): int
    {
        return UserNotification::where('recipient_id', $recipientId)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(UserNotification $notification): UserNotification
    {
        $notification->update(['read_at' => now()]);
        return $notification;
    }

    public function markAllAsRead(int $recipientId): int
    {
        return UserNotification::where('recipient_id', $recipientId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function delete(UserNotification $notification): void
    {
        $notification->delete();
    }
}