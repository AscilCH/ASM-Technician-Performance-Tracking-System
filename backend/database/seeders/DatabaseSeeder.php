<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Technicien;
use App\Models\Reclamation;
use App\Models\Admin;
use App\Models\Mission;
use App\Models\TechMiss;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed Techniciens
        Technicien::factory(10)->create();

        // Seed Reclamations
        Reclamation::factory(20)->create();

        // Seed Admins
        Admin::factory(5)->create();

        // Seed Missions
        Mission::factory(15)->create();

        // Seed TechMiss relationships
        TechMiss::factory(30)->create();
    }
}
