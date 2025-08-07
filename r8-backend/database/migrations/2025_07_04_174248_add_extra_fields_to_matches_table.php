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
        Schema::table('matches', function (Blueprint $table) {
<<<<<<< HEAD
            $table->string('turtle_taken')->nullable();
            $table->string('lord_taken')->nullable();
=======
            $table->integer('turtle_taken')->nullable();
            $table->integer('lord_taken')->nullable();
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
            $table->text('notes')->nullable();
            $table->string('playstyle')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn(['turtle_taken', 'lord_taken', 'notes', 'playstyle']);
        });
    }
};
