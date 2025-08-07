<?php

namespace Database\Seeders;

<<<<<<< HEAD
=======
use App\Models\User;
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
<<<<<<< HEAD
        // Seed admin user and heroes
        $this->call([
            AdminUserSeeder::class,
            HeroSeeder::class,
=======
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
        ]);
    }
}
