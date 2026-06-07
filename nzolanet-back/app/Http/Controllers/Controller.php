<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "NzolaNet API", 
    version: "1.0.0", 
    description: "Backend do Projecto Final de AW"
)]
#[OA\Server(
    url: "http://localhost:8000/api", 
    description: "Servidor Local de Desenvolvimento"
)]

abstract class Controller
{
    #[OA\Get(
        path: "/teste",
        summary: "Rota de teste do Swagger",
        responses: [
            new OA\Response(
                response: 200,
                description: "Swagger funcionando com sucesso!"
            )
        ]
    )]
    public function testeSwagger()
    {
        return response()->json(['status' => 'ok']);
    }
}
