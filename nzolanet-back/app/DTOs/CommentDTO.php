<?php
namespace App\DTOs;

use Illuminate\Http\Request;

class CommentDTO
{
    public function __construct(
        public readonly ?string $texto
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            texto: $request->input('texto')
        );
    }
}
