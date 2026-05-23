<?php
namespace App\DTOs;

use Illuminate\Http\Request;

class UpdateProfileDTO
{
    public function __construct(
        public readonly ?string $nome,
        public readonly ?string $foto_perfil,
        public readonly ?string $privacidade
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            nome: $request->input('nome'),
            foto_perfil: $request->input('foto_perfil'),
            privacidade: $request->input('privacidade')
        );
    }
}