<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function upload(UploadRequest $request) : JsonResponse
    {
        $file = $request->file('media');

        $path = $file->store('uploads', 'public');

        return response()->json([
            'message' => 'Ficheiro armazenado com sucesso',
            'media' => asset('storage/'.$path)
        ], 200);
    }
}
