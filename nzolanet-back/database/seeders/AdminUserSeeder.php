<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'], // Campo de busca único
            [
                'nome'        => 'Administrador Geral',
                'password'    => Hash::make('senha_super_segura_123'), // O cast 'hashed' no Model vai criptografar automaticamente!
                'foto_perfil' => null,
                'privacidade' => true,
                'role'        => 'admin', // Aqui definimos o cargo máximo
            ]
        );
    }
}
