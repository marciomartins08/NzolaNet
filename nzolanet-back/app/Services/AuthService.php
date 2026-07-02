<?php
namespace App\Services;

use App\DTOs\RegisterDTO;
use App\DTOs\LoginDTO;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
public function __construct(
    protected UserRepository $userRepository
) {}

public function register(RegisterDTO $dto)
{
    $user = $this->userRepository->create([
        'nome' => $dto->nome,
        'email' => $dto->email,
        'password' => Hash::make($dto->password),
        'role' => 'user',
    ]);

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
