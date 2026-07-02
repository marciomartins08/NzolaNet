<?php

namespace App\Http\Controllers;

use App\Models\Baze;
use App\Services\BazeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BazeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(
        protected BazeService $bazeService
    )
    {}
    public function index() : JsonResponse
    {
        return response()->json([
            'bazes' => $this->bazeService->getAllBazes()
        ],200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $id) : JsonResponse
    {
        try{
            $baze = $this->bazeService->publicationLike($request->user(), $id);
            return response()->json($baze,200);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage()],403);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Baze $baze)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Baze $baze)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Baze $baze)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Request $request, int $id) : JsonResponse
    {
        try{
            $this->bazeService->publicationRemoveLike($request->user(),$id);
            return response()->json(['message' => 'Like removido com sucesso'],200);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage()],403);
        }
    }
}
