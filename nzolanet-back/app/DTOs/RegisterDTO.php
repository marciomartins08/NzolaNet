<?php
namespace App\DTOs;

use App\Http\Requests\RegisterRequest;

class RegisterDTO
{
    public function __construct(
        public readonly string $nome,
        public readonly string $email,
        public readonly string $password
    ) {}

    public static function fromRequest(RegisterRequest $request): self
    {
        return new self(
            nome: $request->validated('nome'),
            email: $request->validated('email'),
            password: $request->validated('password')
        );
    }
}