<?php
namespace App\Services;

use App\DTOs\RegisterDTO;
use App\DTOs\LoginDTO;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
// Injeção de dependência do repositório
public function __construct(
    protected UserRepository $userRepository
) {}

public function register(RegisterDTO $dto)
{
    // Transforma o DTO num array e encripta a senha
    $user = $this->userRepository->create([
        'nome' => $dto->nome,
        'email' => $dto->email,
        'password' => Hash::make($dto->password),
    ]);

    // Gera o token do Sanctum para o Angular autenticar automaticamente
    $token = $user->createToken('auth_token')->plainTextToken;

    return [
        'user' => $user,
        'token' => $token
    ];
}

public function login(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais introduzidas estão incorretas.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}