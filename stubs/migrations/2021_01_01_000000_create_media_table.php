<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    /**
     * Run the migrations.
     * @return void
     */
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('file')->index();
            $table->string('disk')->index();
            $table->string('mime')->index();
            $table->string('hash')->index();
            $table->unsignedInteger('width')->index();
            $table->unsignedInteger('height')->index();
            $table->unsignedInteger('size')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     */
    public function down()
    {
        Schema::drop('media');
    }
}
