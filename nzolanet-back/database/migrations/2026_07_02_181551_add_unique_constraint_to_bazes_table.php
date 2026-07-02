<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bazes', function (Blueprint $table) {
            $table->unique(['user_id', 'publication_id']);
        });
    }

    public function down(): void
    {
        Schema::table('bazes', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'publication_id']);
            // ou:
            // $table->dropUnique('bazes_user_id_publication_id_unique');
        });
    }
};
