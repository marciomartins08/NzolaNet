<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PublicationService;
use App\DTOs\PublicationDTO;
use Illuminate\Http\JsonResponse;

class PublicationController extends Controller
{
    public function __construct(protected PublicationService $publicationService) {}

    // GET /api/publications
    public function index(): JsonResponse
    {
        $publications = $this->publicationService->getAllPublications();
        return response()->json($publications);
    }

    // POST /api/publications
    public function store(Request $request): JsonResponse
    {
        $dto = PublicationDTO::fromRequest($request);
        $publication = $this->publicationService->createPublication($request->user(), $dto);

        return response()->json([
            'message' => 'Publicação criada com sucesso!',
            'publication' => $publication
        ], 201);
    }

    // PUT /api/publications/{id}
    public function update(Request $request, $id): JsonResponse
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

    // DELETE /api/publications/{id}
    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $this->publicationService->deletePublication((int)$id, $request->user());
            return response()->json(['message' => 'Publicação apagada com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }
}
