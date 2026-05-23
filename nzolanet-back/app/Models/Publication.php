<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'texto',
        'imagem',
        'video',
    ];

    // Relacionamento: A publicação pertence a um Utilizador (Autor)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento: Uma publicação pode ter vários Comentários
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
