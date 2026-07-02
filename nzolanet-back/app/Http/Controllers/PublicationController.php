<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PublicationService;
use App\DTOs\PublicationDTO;
use Illuminate\Http\JsonResponse;

class PublicationController extends Controller
{
    public function __construct(protected PublicationService $publicationService) {}

    public function index(Request $request): JsonResponse
    {
        $publications = $this->publicationService->getAllPublications($request->user());
        return response()->json($publications);
    }

    public function userPublications(Request $request, int $id): JsonResponse
    {
        $publications = $this->publicationService->getUserPublications((int)$id);
        return response()->json($publications);
    }

    public function store(Request $request): JsonResponse
    {
        $dto = PublicationDTO::fromRequest($request);
        $publication = $this->publicationService->createPublication($request->user(), $dto);

        return response()->json([
            'message' => 'Publicação criada com sucesso!',
            'publication' => $publication
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $dto = PublicationDTO::fromRequest($request);
            $publication = $this->publicationService->updatePublication((int)$id, $request->user(), $dto);

            return response()->json([
                'message' => 'Publicação atualizada com sucesso!',
                'publication' => $publication
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->publicationService->deletePublication((int)$id, $request->user());
            return response()->json(['message' => 'Publicação apagada com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function deletar(Request $request, int $id): JsonResponse
    {
        try {
            $this->publicationService->deletePublicationAny($id);
            return response()->json(['message' => 'Publicação apagada com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function contar() : JsonResponse
    {
        return response()->json([
            'count' => $this->publicationService->countPublications(),
        ],200);
    }
}
