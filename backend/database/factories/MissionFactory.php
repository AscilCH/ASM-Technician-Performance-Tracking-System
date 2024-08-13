<?php

namespace Database\Factories;

use App\Models\Mission;
use Illuminate\Database\Eloquent\Factories\Factory;

class MissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Mission::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nom' => $this->faker->word,
            'type' => $this->faker->randomElement(['installation', 'integration']),
            'DateDeb' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'DateFin' => $this->faker->dateTimeBetween('+1 month', '+6 months'),
            'Difficulté' => $this->faker->numberBetween(1, 5),
            'Status' => $this->faker->randomElement(['en attente', 'en execution', 'executé', 'expiré']),
        ];
    }
}
