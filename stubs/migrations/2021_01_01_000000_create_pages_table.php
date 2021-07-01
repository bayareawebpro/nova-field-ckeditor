<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('media_id')->nullable()->index();
            $table->string('title',255)->index();
            $table->string('slug',255)->index();
            $table->text('excerpt')->nullable();
            $table->mediumText('content')->nullable();
            $table->string('meta_title',160)->nullable();
            $table->string('meta_description',160)->nullable();
            $table->string('meta_robots')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     */
    public function down()
    {
        Schema::drop('pages');
    }
}
