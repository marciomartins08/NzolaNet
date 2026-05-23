<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Campos que podem ser preenchidos em massa
    protected $fillable = [
        'nome',
        'email',
        'password',
        'foto_perfil',
        'privacidade',
    ];

    // Oculta campos sensíveis nas respostas da API por padrão
    protected $hidden = [
        'password',
    ];

    // Relacionamento: Um utilizador tem muitas publicações
    public function publications()
    {
        return $this->hasMany(Publication::class);
    }

    // Relacionamento: Um utilizador tem muitos comentários
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Quem segue este utilizador (os meus seguidores)
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id')->withTimestamps();
    }

    // Quem este utilizador está a seguir (as minhas conexões)
    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id')->withTimestamps();
    }
}