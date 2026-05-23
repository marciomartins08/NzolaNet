<?php
namespace App\DTOs;

use Illuminate\Http\Request;

class PublicationDTO
{
    public function __construct(
        public readonly ?string $texto,
        public readonly ?string $imagem,
        public readonly ?string $video
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            texto: $request->input('texto'),
            imagem: $request->input('imagem'),
            video: $request->input('video')
        );
    }
}
