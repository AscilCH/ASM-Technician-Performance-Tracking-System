<?php

namespace Database\Factories;

use App\Models\TechMiss;
use Illuminate\Database\Eloquent\Factories\Factory;

class TechMissFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TechMiss::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id_Tech' => \App\Models\Technicien::factory(),
            'id_Miss' => \App\Models\Mission::factory(),
            'id_Ad' => \App\Models\Admin::factory(),
        ];
    }
}
