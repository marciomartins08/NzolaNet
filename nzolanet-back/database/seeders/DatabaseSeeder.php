<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nome' => 'Marcio Martins',
            'email' => 'marcio@nzolanet.com',
            'password' => Hash::make('123456'),
            'foto_perfil' => 'profiles/marcio.jpg',
            'privacidade' => 'publico'
        ]);

        User::create([
            'nome' => 'Ivanilson Jerónimo',
            'email' => 'ivanilson@nzolanet.com',
            'password' => Hash::make('123456'),
            'foto_perfil' => 'profiles/ivanilson.jpg',
            'privacidade' => 'publico'
        ]);

        User::create([
            'nome' => 'Elisa',
            'email' => 'elisa@nzolanet.com',
            'password' => Hash::make('123456'),
            'foto_perfil' => 'profiles/elisa.jpg',
            'privacidade' => 'privado'
        ]);
    }
}