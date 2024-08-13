<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdClToTechMissTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tech_misses', function (Blueprint $table) {
            $table->unsignedBigInteger('id_cl')->nullable();

            // Ajouter la clé étrangère
            $table->foreign('id_cl')->references('id')->on('clients')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tech_misses', function (Blueprint $table) {
            $table->dropForeign(['id_cl']);
            $table->dropColumn('id_cl');
        });
    }
}
