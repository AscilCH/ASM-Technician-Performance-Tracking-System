<?php

namespace Database\Factories;

use App\Models\Reclamation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReclamationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reclamation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'technicien_id' => \App\Models\Technicien::factory(),
            'titre' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'image' => json_encode([
                'url' => $this->faker->imageUrl(),
                'caption' => $this->faker->sentence,
            ]),
        ];
    }
}
