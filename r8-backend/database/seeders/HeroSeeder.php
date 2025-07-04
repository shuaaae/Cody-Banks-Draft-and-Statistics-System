<?php

namespace Database\Seeders;

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
                ),
                1 =>
                array (
                  'name' => 'Benedetta',
                  'role' => 'Assassin',
                  'image' => 'Benedetta.jpg',
                ),
                2 =>
                array (
                  'name' => 'Fanny',
                  'role' => 'Assassin',
                  'image' => 'Fanny.jpg',
                ),
                3 =>
                array (
                  'name' => 'Gusion',
                  'role' => 'Assassin',
                  'image' => 'Gusion.jpg',
                ),
                4 =>
                array (
                  'name' => 'Hanzo',
                  'role' => 'Assassin',
                  'image' => 'Hanzo.jpg',
                ),
                5 =>
                array (
                  'name' => 'Harley',
                  'role' => 'Assassin',
                  'image' => 'Harley.jpg',
                ),
                6 =>
                array (
                  'name' => 'Hayabusa',
                  'role' => 'Assassin',
                  'image' => 'Hayabusa.jpg',
                ),
                7 =>
                array (
                  'name' => 'Helcurt',
                  'role' => 'Assassin',
                  'image' => 'Helcurt.jpg',
                ),
                8 =>
                array (
                  'name' => 'Joy',
                  'role' => 'Assassin',
                  'image' => 'Joy.jpg',
                ),
                9 =>
                array (
                  'name' => 'Julian',
                  'role' => 'Assassin',
                  'image' => 'Julian.jpg',
                ),
                10 =>
                array (
                  'name' => 'Karina',
                  'role' => 'Assassin',
                  'image' => 'Karina.jpg',
                ),
                11 =>
                array (
                  'name' => 'Lancelot',
                  'role' => 'Assassin',
                  'image' => 'Lancelot.jpg',
                ),
                12 =>
                array (
                  'name' => 'Ling',
                  'role' => 'Assassin',
                  'image' => 'Ling.jpg',
                ),
                13 =>
                array (
                  'name' => 'Natalia',
                  'role' => 'Assassin',
                  'image' => 'Natalia.jpg',
                ),
                14 =>
                array (
                  'name' => 'Nolan',
                  'role' => 'Assassin',
                  'image' => 'Nolan.jpg',
                ),
                15 =>
                array (
                  'name' => 'Saber',
                  'role' => 'Assassin',
                  'image' => 'Saber.jpg',
                ),
                16 =>
                array (
                  'name' => 'Selena',
                  'role' => 'Assassin',
                  'image' => 'Selena.jpg',
                ),
                17 =>
                array (
                  'name' => 'Suyou',
                  'role' => 'Assassin',
                  'image' => 'Suyou.jpg',
                ),
                18 =>
                array (
                  'name' => 'Yi Sun-shin',
                  'role' => 'Assassin',
                  'image' => 'Yi Sun-shin.jpg',
                ),
                19 =>
                array (
                  'name' => 'Aldous',
                  'role' => 'Fighter',
                  'image' => 'Aldous.jpg',
                ),
                20 =>
                array (
                  'name' => 'Alpha',
                  'role' => 'Fighter',
                  'image' => 'Alpha.jpg',
                ),
                21 =>
                array (
                  'name' => 'Alucard',
                  'role' => 'Fighter',
                  'image' => 'Alucard.jpg',
                ),
                22 =>
                array (
                  'name' => 'Argus',
                  'role' => 'Fighter',
                  'image' => 'Argus.jpg',
                ),
                23 =>
                array (
                  'name' => 'Arlott',
                  'role' => 'Fighter',
                  'image' => 'Arlott.jpg',
                ),
                24 =>
                array (
                  'name' => 'Aulus',
                  'role' => 'Fighter',
                  'image' => 'Aulus.jpg',
                ),
                25 =>
                array (
                  'name' => 'Badang',
                  'role' => 'Fighter',
                  'image' => 'Badang.jpg',
                ),
                26 =>
                array (
                  'name' => 'Balmond',
                  'role' => 'Fighter',
                  'image' => 'Balmond.jpg',
                ),
                27 =>
                array (
                  'name' => 'Bane',
                  'role' => 'Fighter',
                  'image' => 'Bane.jpg',
                ),
                28 =>
                array (
                  'name' => 'Chou',
                  'role' => 'Fighter',
                  'image' => 'Chou.jpg',
                ),
                29 =>
                array (
                  'name' => 'Cici',
                  'role' => 'Fighter',
                  'image' => 'Cici.jpg',
                ),
                30 =>
                array (
                  'name' => 'Dyrroth',
                  'role' => 'Fighter',
                  'image' => 'Dyrroth.jpg',
                ),
                31 =>
                array (
                  'name' => 'Fredrinn',
                  'role' => 'Fighter',
                  'image' => 'Fredrinn.jpg',
                ),
                32 =>
                array (
                  'name' => 'Freya',
                  'role' => 'Fighter',
                  'image' => 'Freya.jpg',
                ),
                33 =>
                array (
                  'name' => 'Guinevere',
                  'role' => 'Fighter',
                  'image' => 'Guinevere.jpg',
                ),
                34 =>
                array (
                  'name' => 'Hilda',
                  'role' => 'Fighter',
                  'image' => 'Hilda.jpg',
                ),
                35 =>
                array (
                  'name' => 'Jawhead',
                  'role' => 'Fighter',
                  'image' => 'Jawhead.jpg',
                ),
                36 =>
                array (
                  'name' => 'Khaleed',
                  'role' => 'Fighter',
                  'image' => 'Khaleed.jpg',
                ),
                37 =>
                array (
                  'name' => 'Lapu-Lapu',
                  'role' => 'Fighter',
                  'image' => 'Lapu-Lapu.jpg',
                ),
                38 =>
                array (
                  'name' => 'Leomord',
                  'role' => 'Fighter',
                  'image' => 'Leomord.jpg',
                ),
                39 =>
                array (
                  'name' => 'Lukas',
                  'role' => 'Fighter',
                  'image' => 'Lukas.jpg',
                ),
                40 =>
                array (
                  'name' => 'Martis',
                  'role' => 'Fighter',
                  'image' => 'Martis.jpg',
                ),
                41 =>
                array (
                  'name' => 'Masha',
                  'role' => 'Fighter',
                  'image' => 'Masha.jpg',
                ),
                42 =>
                array (
                  'name' => 'Minsitthar',
                  'role' => 'Fighter',
                  'image' => 'Minsitthar.jpg',
                ),
                43 =>
                array (
                  'name' => 'Paquito',
                  'role' => 'Fighter',
                  'image' => 'Paquito.jpg',
                ),
                44 =>
                array (
                  'name' => 'Phoveus',
                  'role' => 'Fighter',
                  'image' => 'Phoveus.jpg',
                ),
                45 =>
                array (
                  'name' => 'Roger',
                  'role' => 'Fighter',
                  'image' => 'Roger.jpg',
                ),
                46 =>
                array (
                  'name' => 'Ruby',
                  'role' => 'Fighter',
                  'image' => 'Ruby.jpg',
                ),
                47 =>
                array (
                  'name' => 'Silvanna',
                  'role' => 'Fighter',
                  'image' => 'Silvanna.jpg',
                ),
                48 =>
                array (
                  'name' => 'Sun',
                  'role' => 'Fighter',
                  'image' => 'Sun.jpg',
                ),
                49 =>
                array (
                  'name' => 'Terizla',
                  'role' => 'Fighter',
                  'image' => 'Terizla.jpg',
                ),
                50 =>
                array (
                  'name' => 'Thamuz',
                  'role' => 'Fighter',
                  'image' => 'Thamuz.jpg',
                ),
                51 =>
                array (
                  'name' => 'X.Borg',
                  'role' => 'Fighter',
                  'image' => 'X.Borg.jpg',
                ),
                52 =>
                array (
                  'name' => 'Yin',
                  'role' => 'Fighter',
                  'image' => 'Yin.jpg',
                ),
                53 =>
                array (
                  'name' => 'Yu Zhong',
                  'role' => 'Fighter',
                  'image' => 'Yu Zhong.jpg',
                ),
                54 =>
                array (
                  'name' => 'Zilong',
                  'role' => 'Fighter',
                  'image' => 'Zilong.jpg',
                ),
                55 =>
                array (
                  'name' => 'Alice',
                  'role' => 'Mage',
                  'image' => 'Alice.jpg',
                ),
                56 =>
                array (
                  'name' => 'Aurora',
                  'role' => 'Mage',
                  'image' => 'Aurora.jpg',
                ),
                57 =>
                array (
                  'name' => 'Cecilion',
                  'role' => 'Mage',
                  'image' => 'Cecilion.jpg',
                ),
                58 =>
                array (
                  'name' => 'Chang_e',
                  'role' => 'Mage',
                  'image' => 'Chang_e.jpg',
                ),
                59 =>
                array (
                  'name' => 'Cyclops',
                  'role' => 'Mage',
                  'image' => 'Cyclops.jpg',
                ),
                60 =>
                array (
                  'name' => 'Eudora',
                  'role' => 'Mage',
                  'image' => 'Eudora.jpg',
                ),
                61 =>
                array (
                  'name' => 'Gord',
                  'role' => 'Mage',
                  'image' => 'Gord.jpg',
                ),
                62 =>
                array (
                  'name' => 'Harith',
                  'role' => 'Mage',
                  'image' => 'Harith.jpg',
                ),
                63 =>
                array (
                  'name' => 'Kadita',
                  'role' => 'Mage',
                  'image' => 'Kadita.jpg',
                ),
                64 =>
                array (
                  'name' => 'Kagura',
                  'role' => 'Mage',
                  'image' => 'Kagura.jpg',
                ),
                65 =>
                array (
                  'name' => 'Lunox',
                  'role' => 'Mage',
                  'image' => 'Lunox.jpg',
                ),
                66 =>
                array (
                  'name' => 'Luo Yi',
                  'role' => 'Mage',
                  'image' => 'Luo Yi.jpg',
                ),
                67 =>
                array (
                  'name' => 'Lylia',
                  'role' => 'Mage',
                  'image' => 'Lylia.jpg',
                ),
                68 =>
                array (
                  'name' => 'Nana',
                  'role' => 'Mage',
                  'image' => 'Nana.jpg',
                ),
                69 =>
                array (
                  'name' => 'Novaria',
                  'role' => 'Mage',
                  'image' => 'Novaria.jpg',
                ),
                70 =>
                array (
                  'name' => 'Odette',
                  'role' => 'Mage',
                  'image' => 'Odette.jpg',
                ),
                71 =>
                array (
                  'name' => 'Pharsa',
                  'role' => 'Mage',
                  'image' => 'Pharsa.jpg',
                ),
                72 =>
                array (
                  'name' => 'Vale',
                  'role' => 'Mage',
                  'image' => 'Vale.jpg',
                ),
                73 =>
                array (
                  'name' => 'Valentina',
                  'role' => 'Mage',
                  'image' => 'Valentina.jpg',
                ),
                74 =>
                array (
                  'name' => 'Valir',
                  'role' => 'Mage',
                  'image' => 'Valir.jpg',
                ),
                75 =>
                array (
                  'name' => 'Vexana',
                  'role' => 'Mage',
                  'image' => 'Vexana.jpg',
                ),
                76 =>
                array (
                  'name' => 'Xavier',
                  'role' => 'Mage',
                  'image' => 'Xavier.jpg',
                ),
                77 =>
                array (
                  'name' => 'Yve',
                  'role' => 'Mage',
                  'image' => 'Yve.jpg',
                ),
                78 =>
                array (
                  'name' => 'Zetian',
                  'role' => 'Mage',
                  'image' => 'Zetian.jpg',
                ),
                79 =>
                array (
                  'name' => 'Zhask',
                  'role' => 'Mage',
                  'image' => 'Zhask.jpg',
                ),
                80 =>
                array (
                  'name' => 'Zhuxin',
                  'role' => 'Mage',
                  'image' => 'Zhuxin.jpg',
                ),
                81 =>
                array (
                  'name' => 'Beatrix',
                  'role' => 'Marksman',
                  'image' => 'Beatrix.jpg',
                ),
                82 =>
                array (
                  'name' => 'Brody',
                  'role' => 'Marksman',
                  'image' => 'Brody.jpg',
                ),
                83 =>
                array (
                  'name' => 'Bruno',
                  'role' => 'Marksman',
                  'image' => 'Bruno.jpg',
                ),
                84 =>
                array (
                  'name' => 'Claude',
                  'role' => 'Marksman',
                  'image' => 'Claude.jpg',
                ),
                85 =>
                array (
                  'name' => 'Clint',
                  'role' => 'Marksman',
                  'image' => 'Clint.jpg',
                ),
                86 =>
                array (
                  'name' => 'Granger',
                  'role' => 'Marksman',
                  'image' => 'Granger.jpg',
                ),
                87 =>
                array (
                  'name' => 'Hanabi',
                  'role' => 'Marksman',
                  'image' => 'Hanabi.jpg',
                ),
                88 =>
                array (
                  'name' => 'Irithel',
                  'role' => 'Marksman',
                  'image' => 'Irithel.jpg',
                ),
                89 =>
                array (
                  'name' => 'Ixia',
                  'role' => 'Marksman',
                  'image' => 'Ixia.jpg',
                ),
                90 =>
                array (
                  'name' => 'Karrie, the Lost Star',
                  'role' => 'Marksman',
                  'image' => 'Karrie, the Lost Star.jpg',
                ),
                91 =>
                array (
                  'name' => 'Kimmy',
                  'role' => 'Marksman',
                  'image' => 'Kimmy.jpg',
                ),
                92 =>
                array (
                  'name' => 'Layla',
                  'role' => 'Marksman',
                  'image' => 'Layla.jpg',
                ),
                93 =>
                array (
                  'name' => 'Lesley',
                  'role' => 'Marksman',
                  'image' => 'Lesley.jpg',
                ),
                94 =>
                array (
                  'name' => 'Melissa',
                  'role' => 'Marksman',
                  'image' => 'Melissa.jpg',
                ),
                95 =>
                array (
                  'name' => 'Miya',
                  'role' => 'Marksman',
                  'image' => 'Miya.jpg',
                ),
                96 =>
                array (
                  'name' => 'Moskov',
                  'role' => 'Marksman',
                  'image' => 'Moskov.jpg',
                ),
                97 =>
                array (
                  'name' => 'Natan',
                  'role' => 'Marksman',
                  'image' => 'Natan.jpg',
                ),
                98 =>
                array (
                  'name' => 'Popol and Kupa',
                  'role' => 'Marksman',
                  'image' => 'Popol and Kupa.jpg',
                ),
                99 =>
                array (
                  'name' => 'Wanwan',
                  'role' => 'Marksman',
                  'image' => 'Wanwan.jpg',
                ),
                100 =>
                array (
                  'name' => 'Angela',
                  'role' => 'Support',
                  'image' => 'Angela.jpg',
                ),
                101 =>
                array (
                  'name' => 'Carmilla',
                  'role' => 'Support',
                  'image' => 'Carmilla.jpg',
                ),
                102 =>
                array (
                  'name' => 'Chip',
                  'role' => 'Support',
                  'image' => 'Chip.jpg',
                ),
                103 =>
                array (
                  'name' => 'Diggie',
                  'role' => 'Support',
                  'image' => 'Diggie.jpg',
                ),
                104 =>
                array (
                  'name' => 'Estes',
                  'role' => 'Support',
                  'image' => 'Estes.jpg',
                ),
                105 =>
                array (
                  'name' => 'Faramis',
                  'role' => 'Support',
                  'image' => 'Faramis.jpg',
                ),
                106 =>
                array (
                  'name' => 'Floryn',
                  'role' => 'Support',
                  'image' => 'Floryn.jpg',
                ),
                107 =>
                array (
                  'name' => 'Kaja',
                  'role' => 'Support',
                  'image' => 'Kaja.jpg',
                ),
                108 =>
                array (
                  'name' => 'Kalea',
                  'role' => 'Support',
                  'image' => 'Kalea.jpg',
                ),
                109 =>
                array (
                  'name' => 'Lolita',
                  'role' => 'Support',
                  'image' => 'Lolita.jpg',
                ),
                110 =>
                array (
                  'name' => 'Mathilda',
                  'role' => 'Support',
                  'image' => 'Mathilda.jpg',
                ),
                111 =>
                array (
                  'name' => 'Rafaela',
                  'role' => 'Support',
                  'image' => 'Rafaela.jpg',
                ),
                112 =>
                array (
                  'name' => 'Akai',
                  'role' => 'Tank',
                  'image' => 'Akai.jpg',
                ),
                113 =>
                array (
                  'name' => 'Atlas',
                  'role' => 'Tank',
                  'image' => 'Atlas.jpg',
                ),
                114 =>
                array (
                  'name' => 'Barats',
                  'role' => 'Tank',
                  'image' => 'Barats.jpg',
                ),
                115 =>
                array (
                  'name' => 'Baxia',
                  'role' => 'Tank',
                  'image' => 'Baxia.jpg',
                ),
                116 =>
                array (
                  'name' => 'Belerick',
                  'role' => 'Tank',
                  'image' => 'Belerick.jpg',
                ),
                117 =>
                array (
                  'name' => 'Edith',
                  'role' => 'Tank',
                  'image' => 'Edith.jpg',
                ),
                118 =>
                array (
                  'name' => 'Esmeralda',
                  'role' => 'Tank',
                  'image' => 'Esmeralda.jpg',
                ),
                119 =>
                array (
                  'name' => 'Franco',
                  'role' => 'Tank',
                  'image' => 'Franco.jpg',
                ),
                120 =>
                array (
                  'name' => 'Gatotkaca',
                  'role' => 'Tank',
                  'image' => 'Gatotkaca.jpg',
                ),
                121 =>
                array (
                  'name' => 'Gloo',
                  'role' => 'Tank',
                  'image' => 'Gloo.jpg',
                ),
                122 =>
                array (
                  'name' => 'Grock',
                  'role' => 'Tank',
                  'image' => 'Grock.jpg',
                ),
                123 =>
                array (
                  'name' => 'Hylos',
                  'role' => 'Tank',
                  'image' => 'Hylos.jpg',
                ),
                124 =>
                array (
                  'name' => 'Johnson',
                  'role' => 'Tank',
                  'image' => 'Johnson.jpg',
                ),
                125 =>
                array (
                  'name' => 'Khufra',
                  'role' => 'Tank',
                  'image' => 'Khufra.jpg',
                ),
                126 =>
                array (
                  'name' => 'Minotaur',
                  'role' => 'Tank',
                  'image' => 'Minotaur.jpg',
                ),
                127 =>
                array (
                  'name' => 'Tigreal',
                  'role' => 'Tank',
                  'image' => 'Tigreal.jpg',
                ),
                128 =>
                array (
                  'name' => 'Uranus',
                  'role' => 'Tank',
                  'image' => 'Uranus.jpg',
                ),
              )
            );
    }
}