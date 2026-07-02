<?php
namespace App\Repositories;

use App\Models\Baze;
use Illuminate\Database\Eloquent\Collection;

class BazeRepository
{
    public function create(array $data) : Baze
    {
        return Baze::create($data);
    }

    public function delete(Baze $baze) : void
    {
        $baze->delete();
    }

    public function findById(int $id) : ?Baze
    {
        return Baze::findOrFail($id);
    }

    public function findByPubIdAndUserId(int $idUser, int $idPublicacao) : ?Baze
    {
        return Baze::where('user_id',$idUser)
                    ->where('publication_id',$idPublicacao)
                    ->first();
    }

    public function all() : Collection
    {
        return Baze::with(['user', 'publication'])
                ->latest()
                ->get();
    }
}

?>
