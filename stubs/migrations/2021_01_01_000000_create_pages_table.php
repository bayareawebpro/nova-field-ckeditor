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
            $table->bigIncrements('id')->index();

            $table->unsignedBigInteger('media_id')->nullable()->index();

            $table->string('title')->index();
            $table->string('slug')->index();
            $table->text('excerpt')->nullable()->default(null);
            $table->mediumText('content')->nullable()->default(null);

            $table->string('meta_title')->nullable()->default(null);
            $table->string('meta_robots')->nullable()->default('index,follow')->index();
            $table->text('meta_description')->nullable()->default(null);

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
