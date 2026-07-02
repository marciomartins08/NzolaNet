<?php

namespace App\Http\Controllers;

use App\DTOs\CommentDTO;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(protected CommentService $commentService) {}

    public function index($publicationId): JsonResponse
    {
        try {
            $comments = $this->commentService->getCommentsByPublication((int) $publicationId);
            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function getComment(Request $request, int $id) : JsonResponse{
        try {
            $comment = $this->commentService->getCommentById((int) $id, $request->user());
            return response()->json([
                'comment' => $comment,
            ],200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function store(Request $request, $publicationId): JsonResponse
    {
        try {
            $dto = CommentDTO::fromRequest($request);
            $comment = $this->commentService->createComment(
                $request->user(),
                (int) $publicationId,
                $dto
            );

            return response()->json([
                'message' => 'Comentário criado com sucesso!',
                'comment' => $comment->load('user'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $dto = CommentDTO::fromRequest($request);
            $comment = $this->commentService->updateComment((int) $id, $request->user(), $dto);

            return response()->json([
                'message' => 'Comentário atualizado com sucesso!',
                'comment' => $comment->load('user'),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function listar() : JsonResponse
    {
        $arr = $this->commentService->getAllComments();
        return response()->json($arr,200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $this->commentService->deleteComment((int) $id, $request->user());
            return response()->json(['message' => 'Comentário apagado com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function deletar(Request $request, $id): JsonResponse
    {
        try {
            $this->commentService->deleteCommentAdmin((int) $id);
            return response()->json(['message' => 'Comentário apagado com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function contar() : JsonResponse
    {
        $contador = $this->commentService->getCount();

        return response()->json(
            ['count' => $contador]
        , 200);
    }
}
