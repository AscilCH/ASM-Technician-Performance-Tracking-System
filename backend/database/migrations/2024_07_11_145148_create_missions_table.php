<?php
// database/migrations/YYYY_MM_DD_HHMMSS_create_missions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('type', ['installation', 'integration']);
            $table->date('DateDeb');
            $table->date('DateFin');
            $table->integer('Difficulté');
            $table->enum('Status', ['en attente', 'en execution', 'executé', 'expiré']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('missions');
    }
}
