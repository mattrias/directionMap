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
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('start_location', 500);
            $table->string('end_location', 500);
            $table->decimal('start_lat', 10, 7);
            $table->decimal('start_lng', 10, 7);
            $table->decimal('end_lat', 10, 7);
            $table->decimal('end_lng', 10, 7);
            $table->json('path_coordinates')->nullable();
            $table->timestamps();
            
            // Add index for better performance
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};