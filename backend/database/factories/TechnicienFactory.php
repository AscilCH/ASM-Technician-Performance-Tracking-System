<?php


namespace Database\Factories;

use App\Models\Technicien;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TechnicienFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Technicien::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // Example password hashing
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'score' => $this->faker->numberBetween(0, 100),
            'type' => $this->faker->randomElement(['installation', 'integration', 'SAV']),
            'photo' => null, // Optionally generate a fake photo URL or leave null
        ];
    }
}
