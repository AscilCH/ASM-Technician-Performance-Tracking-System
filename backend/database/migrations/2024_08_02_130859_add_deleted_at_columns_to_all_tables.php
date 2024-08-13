<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtColumnsToAllTables extends Migration
{
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            if (!Schema::hasColumn('admins', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('clients', function (Blueprint $table) {
            if (!Schema::hasColumn('clients', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('failed_jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('failed_jobs', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('migrations', function (Blueprint $table) {
            if (!Schema::hasColumn('migrations', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('missions', function (Blueprint $table) {
            if (!Schema::hasColumn('missions', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('password_resets', function (Blueprint $table) {
            if (!Schema::hasColumn('password_resets', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            if (!Schema::hasColumn('personal_access_tokens', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('reclamations', function (Blueprint $table) {
            if (!Schema::hasColumn('reclamations', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('sessions', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('techniciens', function (Blueprint $table) {
            if (!Schema::hasColumn('techniciens', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('tech_misses', function (Blueprint $table) {
            if (!Schema::hasColumn('tech_misses', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('migrations', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('missions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('password_resets', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('reclamations', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('techniciens', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('tech_misses', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
