<?php

namespace Database\Seeders;

<<<<<<< HEAD
use Illuminate\Database\Seeder;
use App\Models\Hero;

class HeroSeeder extends Seeder
{
  public function run()
  {
        $heroes = array(
            0 => array(
                  'name' => 'Aamon',
                  'role' => 'Assassin',
                  'image' => 'Aamon.webp',
=======
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hero; // ✅ Correct place for the import

class HeroSeeder extends Seeder
{
    public function run()
    {
        Hero::insert(
            array (
                0 =>
                array (
                  'name' => 'Aamon',
                  'role' => 'Assassin',
                  'image' => 'Aamon.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                1 =>
                array (
                  'name' => 'Benedetta',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Benedetta.webp',
=======
                  'image' => 'Benedetta.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                2 =>
                array (
                  'name' => 'Fanny',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Fanny.webp',
=======
                  'image' => 'Fanny.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                3 =>
                array (
                  'name' => 'Gusion',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Gusion.webp',
=======
                  'image' => 'Gusion.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                4 =>
                array (
                  'name' => 'Hanzo',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Hanzo.webp',
=======
                  'image' => 'Hanzo.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                5 =>
                array (
                  'name' => 'Harley',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Harley.webp',
=======
                  'image' => 'Harley.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                6 =>
                array (
                  'name' => 'Hayabusa',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Hayabusa.webp',
=======
                  'image' => 'Hayabusa.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                7 =>
                array (
                  'name' => 'Helcurt',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Helcurt.webp',
=======
                  'image' => 'Helcurt.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                8 =>
                array (
                  'name' => 'Joy',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Joy.webp',
=======
                  'image' => 'Joy.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                9 =>
                array (
                  'name' => 'Julian',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Julian.webp',
=======
                  'image' => 'Julian.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                10 =>
                array (
                  'name' => 'Karina',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Karina.webp',
=======
                  'image' => 'Karina.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                11 =>
                array (
                  'name' => 'Lancelot',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Lancelot.webp',
=======
                  'image' => 'Lancelot.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                12 =>
                array (
                  'name' => 'Ling',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Ling.webp',
=======
                  'image' => 'Ling.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                13 =>
                array (
                  'name' => 'Natalia',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Natalia.webp',
=======
                  'image' => 'Natalia.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                14 =>
                array (
                  'name' => 'Nolan',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Nolan.webp',
=======
                  'image' => 'Nolan.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                15 =>
                array (
                  'name' => 'Saber',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Saber.webp',
=======
                  'image' => 'Saber.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                16 =>
                array (
                  'name' => 'Selena',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Selena.webp',
=======
                  'image' => 'Selena.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                17 =>
                array (
                  'name' => 'Suyou',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Suyou.webp',
=======
                  'image' => 'Suyou.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                18 =>
                array (
                  'name' => 'Yi Sun-shin',
                  'role' => 'Assassin',
<<<<<<< HEAD
                  'image' => 'Yi Sun-shin.webp',
=======
                  'image' => 'Yi Sun-shin.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                19 =>
                array (
                  'name' => 'Aldous',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Aldous.webp',
=======
                  'image' => 'Aldous.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                20 =>
                array (
                  'name' => 'Alpha',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Alpha.webp',
=======
                  'image' => 'Alpha.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                21 =>
                array (
                  'name' => 'Alucard',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Alucard.webp',
=======
                  'image' => 'Alucard.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                22 =>
                array (
                  'name' => 'Argus',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Argus.webp',
=======
                  'image' => 'Argus.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                23 =>
                array (
                  'name' => 'Arlott',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Arlott.webp',
=======
                  'image' => 'Arlott.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                24 =>
                array (
                  'name' => 'Aulus',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Aulus.webp',
=======
                  'image' => 'Aulus.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                25 =>
                array (
                  'name' => 'Badang',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Badang.webp',
=======
                  'image' => 'Badang.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                26 =>
                array (
                  'name' => 'Balmond',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Balmond.webp',
=======
                  'image' => 'Balmond.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                27 =>
                array (
                  'name' => 'Bane',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Bane.webp',
=======
                  'image' => 'Bane.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                28 =>
                array (
                  'name' => 'Chou',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Chou.webp',
=======
                  'image' => 'Chou.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                29 =>
                array (
                  'name' => 'Cici',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Cici.webp',
=======
                  'image' => 'Cici.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                30 =>
                array (
                  'name' => 'Dyrroth',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Dyrroth.webp',
=======
                  'image' => 'Dyrroth.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                31 =>
                array (
                  'name' => 'Fredrinn',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Fredrinn.webp',
=======
                  'image' => 'Fredrinn.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                32 =>
                array (
                  'name' => 'Freya',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Freya.webp',
=======
                  'image' => 'Freya.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                33 =>
                array (
                  'name' => 'Guinevere',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Guinevere.webp',
=======
                  'image' => 'Guinevere.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                34 =>
                array (
                  'name' => 'Hilda',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Hilda.webp',
=======
                  'image' => 'Hilda.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                35 =>
                array (
                  'name' => 'Jawhead',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Jawhead.webp',
=======
                  'image' => 'Jawhead.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                36 =>
                array (
                  'name' => 'Khaleed',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Khaleed.webp',
=======
                  'image' => 'Khaleed.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                37 =>
                array (
                  'name' => 'Lapu-Lapu',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Lapu-Lapu.webp',
=======
                  'image' => 'Lapu-Lapu.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                38 =>
                array (
                  'name' => 'Leomord',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Leomord.webp',
=======
                  'image' => 'Leomord.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                39 =>
                array (
                  'name' => 'Lukas',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Lukas.webp',
=======
                  'image' => 'Lukas.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                40 =>
                array (
                  'name' => 'Martis',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Martis.webp',
=======
                  'image' => 'Martis.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                41 =>
                array (
                  'name' => 'Masha',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Masha.webp',
=======
                  'image' => 'Masha.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                42 =>
                array (
                  'name' => 'Minsitthar',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Minsitthar.webp',
=======
                  'image' => 'Minsitthar.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                43 =>
                array (
                  'name' => 'Paquito',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Paquito.webp',
=======
                  'image' => 'Paquito.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                44 =>
                array (
                  'name' => 'Phoveus',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Phoveus.webp',
=======
                  'image' => 'Phoveus.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                45 =>
                array (
                  'name' => 'Roger',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Roger.webp',
=======
                  'image' => 'Roger.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                46 =>
                array (
                  'name' => 'Ruby',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Ruby.webp',
=======
                  'image' => 'Ruby.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                47 =>
                array (
                  'name' => 'Silvanna',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Silvanna.webp',
=======
                  'image' => 'Silvanna.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                48 =>
                array (
                  'name' => 'Sun',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Sun.webp',
=======
                  'image' => 'Sun.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                49 =>
                array (
                  'name' => 'Terizla',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Terizla.webp',
=======
                  'image' => 'Terizla.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                50 =>
                array (
                  'name' => 'Thamuz',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Thamuz.webp',
=======
                  'image' => 'Thamuz.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                51 =>
                array (
                  'name' => 'X.Borg',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'X.Borg.webp',
=======
                  'image' => 'X.Borg.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                52 =>
                array (
                  'name' => 'Yin',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Yin.webp',
=======
                  'image' => 'Yin.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                53 =>
                array (
                  'name' => 'Yu Zhong',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Yu Zhong.webp',
=======
                  'image' => 'Yu Zhong.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                54 =>
                array (
                  'name' => 'Zilong',
                  'role' => 'Fighter',
<<<<<<< HEAD
                  'image' => 'Zilong.webp',
=======
                  'image' => 'Zilong.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                55 =>
                array (
                  'name' => 'Alice',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Alice.webp',
=======
                  'image' => 'Alice.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                56 =>
                array (
                  'name' => 'Aurora',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Aurora.webp',
=======
                  'image' => 'Aurora.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                57 =>
                array (
                  'name' => 'Cecilion',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Cecilion.webp',
=======
                  'image' => 'Cecilion.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                58 =>
                array (
                  'name' => 'Chang_e',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Chang_e.webp',
=======
                  'image' => 'Chang_e.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                59 =>
                array (
                  'name' => 'Cyclops',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Cyclops.webp',
=======
                  'image' => 'Cyclops.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                60 =>
                array (
                  'name' => 'Eudora',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Eudora.webp',
=======
                  'image' => 'Eudora.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                61 =>
                array (
                  'name' => 'Gord',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Gord.webp',
=======
                  'image' => 'Gord.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                62 =>
                array (
                  'name' => 'Harith',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Harith.webp',
=======
                  'image' => 'Harith.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                63 =>
                array (
                  'name' => 'Kadita',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Kadita.webp',
=======
                  'image' => 'Kadita.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                64 =>
                array (
                  'name' => 'Kagura',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Kagura.webp',
=======
                  'image' => 'Kagura.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                65 =>
                array (
                  'name' => 'Lunox',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Lunox.webp',
=======
                  'image' => 'Lunox.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                66 =>
                array (
                  'name' => 'Luo Yi',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Luo Yi.webp',
=======
                  'image' => 'Luo Yi.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                67 =>
                array (
                  'name' => 'Lylia',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Lylia.webp',
=======
                  'image' => 'Lylia.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                68 =>
                array (
                  'name' => 'Nana',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Nana.webp',
=======
                  'image' => 'Nana.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                69 =>
                array (
                  'name' => 'Novaria',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Novaria.webp',
=======
                  'image' => 'Novaria.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                70 =>
                array (
                  'name' => 'Odette',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Odette.webp',
=======
                  'image' => 'Odette.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                71 =>
                array (
                  'name' => 'Pharsa',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Pharsa.webp',
=======
                  'image' => 'Pharsa.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                72 =>
                array (
                  'name' => 'Vale',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Vale.webp',
=======
                  'image' => 'Vale.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                73 =>
                array (
                  'name' => 'Valentina',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Valentina.webp',
=======
                  'image' => 'Valentina.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                74 =>
                array (
                  'name' => 'Valir',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Valir.webp',
=======
                  'image' => 'Valir.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                75 =>
                array (
                  'name' => 'Vexana',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Vexana.webp',
=======
                  'image' => 'Vexana.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                76 =>
                array (
                  'name' => 'Xavier',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Xavier.webp',
=======
                  'image' => 'Xavier.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                77 =>
                array (
                  'name' => 'Yve',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Yve.webp',
=======
                  'image' => 'Yve.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                78 =>
                array (
                  'name' => 'Zetian',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Zetian.webp',
=======
                  'image' => 'Zetian.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                79 =>
                array (
                  'name' => 'Zhask',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Zhask.webp',
=======
                  'image' => 'Zhask.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                80 =>
                array (
                  'name' => 'Zhuxin',
                  'role' => 'Mage',
<<<<<<< HEAD
                  'image' => 'Zhuxin.webp',
=======
                  'image' => 'Zhuxin.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                81 =>
                array (
                  'name' => 'Beatrix',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Beatrix.webp',
=======
                  'image' => 'Beatrix.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                82 =>
                array (
                  'name' => 'Brody',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Brody.webp',
=======
                  'image' => 'Brody.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                83 =>
                array (
                  'name' => 'Bruno',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Bruno.webp',
=======
                  'image' => 'Bruno.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                84 =>
                array (
                  'name' => 'Claude',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Claude.webp',
=======
                  'image' => 'Claude.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                85 =>
                array (
                  'name' => 'Clint',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Clint.webp',
=======
                  'image' => 'Clint.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                86 =>
                array (
                  'name' => 'Granger',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Granger.webp',
=======
                  'image' => 'Granger.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                87 =>
                array (
                  'name' => 'Hanabi',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Hanabi.webp',
=======
                  'image' => 'Hanabi.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                88 =>
                array (
                  'name' => 'Irithel',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Irithel.webp',
=======
                  'image' => 'Irithel.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                89 =>
                array (
                  'name' => 'Ixia',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Ixia.webp',
=======
                  'image' => 'Ixia.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                90 =>
                array (
                  'name' => 'Karrie',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Karrie.webp',
=======
                  'image' => 'Karrie.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                91 =>
                array (
                  'name' => 'Kimmy',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Kimmy.webp',
=======
                  'image' => 'Kimmy.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                92 =>
                array (
                  'name' => 'Layla',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Layla.webp',
=======
                  'image' => 'Layla.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                93 =>
                array (
                  'name' => 'Lesley',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Lesley.webp',
=======
                  'image' => 'Lesley.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                94 =>
                array (
                  'name' => 'Melissa',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Melissa.webp',
=======
                  'image' => 'Melissa.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                95 =>
                array (
                  'name' => 'Miya',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Miya.webp',
=======
                  'image' => 'Miya.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                96 =>
                array (
                  'name' => 'Moskov',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Moskov.webp',
=======
                  'image' => 'Moskov.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                97 =>
                array (
                  'name' => 'Natan',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Natan.webp',
=======
                  'image' => 'Natan.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                98 =>
                array (
                  'name' => 'Popol and Kupa',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Popol and Kupa.webp',
=======
                  'image' => 'Popol and Kupa.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                99 =>
                array (
                  'name' => 'Wanwan',
                  'role' => 'Marksman',
<<<<<<< HEAD
                  'image' => 'Wanwan.webp',
=======
                  'image' => 'Wanwan.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                100 =>
                array (
                  'name' => 'Angela',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Angela.webp',
=======
                  'image' => 'Angela.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                101 =>
                array (
                  'name' => 'Carmilla',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Carmilla.webp',
=======
                  'image' => 'Carmilla.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                102 =>
                array (
                  'name' => 'Chip',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Chip.webp',
=======
                  'image' => 'Chip.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                103 =>
                array (
                  'name' => 'Diggie',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Diggie.webp',
=======
                  'image' => 'Diggie.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                104 =>
                array (
                  'name' => 'Estes',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Estes.webp',
=======
                  'image' => 'Estes.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                105 =>
                array (
                  'name' => 'Faramis',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Faramis.webp',
=======
                  'image' => 'Faramis.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                106 =>
                array (
                  'name' => 'Floryn',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Floryn.webp',
=======
                  'image' => 'Floryn.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                107 =>
                array (
                  'name' => 'Kaja',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Kaja.webp',
=======
                  'image' => 'Kaja.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                108 =>
                array (
                  'name' => 'Kalea',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Kalea.webp',
=======
                  'image' => 'Kalea.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                109 =>
                array (
                  'name' => 'Lolita',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Lolita.webp',
=======
                  'image' => 'Lolita.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                110 =>
                array (
                  'name' => 'Mathilda',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Mathilda.webp',
=======
                  'image' => 'Mathilda.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                111 =>
                array (
                  'name' => 'Rafaela',
                  'role' => 'Support',
<<<<<<< HEAD
                  'image' => 'Rafaela.webp',
=======
                  'image' => 'Rafaela.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                112 =>
                array (
                  'name' => 'Akai',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Akai.webp',
=======
                  'image' => 'Akai.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                113 =>
                array (
                  'name' => 'Atlas',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Atlas.webp',
=======
                  'image' => 'Atlas.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                114 =>
                array (
                  'name' => 'Barats',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Barats.webp',
=======
                  'image' => 'Barats.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                115 =>
                array (
                  'name' => 'Baxia',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Baxia.webp',
=======
                  'image' => 'Baxia.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                116 =>
                array (
                  'name' => 'Belerick',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Belerick.webp',
=======
                  'image' => 'Belerick.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                117 =>
                array (
                  'name' => 'Edith',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Edith.webp',
=======
                  'image' => 'Edith.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                118 =>
                array (
                  'name' => 'Esmeralda',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Esmeralda.webp',
=======
                  'image' => 'Esmeralda.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                119 =>
                array (
                  'name' => 'Franco',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Franco.webp',
=======
                  'image' => 'Franco.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                120 =>
                array (
                  'name' => 'Gatotkaca',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Gatotkaca.webp',
=======
                  'image' => 'Gatotkaca.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                121 =>
                array (
                  'name' => 'Gloo',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Gloo.webp',
=======
                  'image' => 'Gloo.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                122 =>
                array (
                  'name' => 'Grock',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Grock.webp',
=======
                  'image' => 'Grock.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                123 =>
                array (
                  'name' => 'Hylos',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Hylos.webp',
=======
                  'image' => 'Hylos.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                124 =>
                array (
                  'name' => 'Johnson',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Johnson.webp',
=======
                  'image' => 'Johnson.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                125 =>
                array (
                  'name' => 'Khufra',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Khufra.webp',
=======
                  'image' => 'Khufra.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                126 =>
                array (
                  'name' => 'Minotaur',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Minotaur.webp',
=======
                  'image' => 'Minotaur.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                127 =>
                array (
                  'name' => 'Tigreal',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Tigreal.webp',
=======
                  'image' => 'Tigreal.jpg',
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
                ),
                128 =>
                array (
                  'name' => 'Uranus',
                  'role' => 'Tank',
<<<<<<< HEAD
                  'image' => 'Uranus.webp',
                ),
            );
    
            // Create heroes in the database
            foreach ($heroes as $hero) {
                Hero::create($hero);
            }
        }
    }
=======
                  'image' => 'Uranus.jpg',
                ),
              )
            );
    }
}
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
