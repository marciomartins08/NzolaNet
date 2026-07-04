<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(protected NotificationService $notificationService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = $this->notificationService->listForUser($user);
        $unreadCount = $this->notificationService->unreadCount($user);

        return response()->json([
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'targetUrl' => $notification->target_url,
                    'read' => $notification->read_at !== null,
                    'created_at' => $notification->created_at,
                    'actor' => $notification->actor ? [
                        'id' => $notification->actor->id,
                        'nome' => $notification->actor->nome,
                        'foto_perfil' => $notification->actor->foto_perfil,
                    ] : null,
                ];
            }),
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($request->user(), $id);

        return response()->json([
            'message' => 'Notificação marcada como lida.',
            'notification' => $notification,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'message' => 'Todas as notificações foram marcadas como lidas.',
            'updated' => $count,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->notificationService->deleteForUser($request->user(), $id);

        return response()->json([
            'message' => 'Notificação removida com sucesso.',
        ]);
    }
}