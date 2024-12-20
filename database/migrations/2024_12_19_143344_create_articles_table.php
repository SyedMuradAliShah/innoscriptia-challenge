<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() : void
    {
        Schema::create('articles', function (Blueprint $table)
        {

            $table->id();
            $table->string('slug')->unique();

            $table->string('title');
            $table->text('description')->nullable();
            $table->string('author')->nullable();
            $table->string('external_url')->nullable();

            $table->string('source')->nullable();
            $table->string('source_url')->nullable();
            $table->string('image_url')->nullable();

            $table->string('api_used')->nullable();

            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down() : void
    {
        Schema::dropIfExists('articles');
    }
};
