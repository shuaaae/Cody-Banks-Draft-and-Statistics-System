<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

<<<<<<< HEAD
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'], // your frontend URL
=======
    'allowed_origins' => ['http://localhost:3000'], // your frontend URL
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

<<<<<<< HEAD
    'supports_credentials' => true,
=======
    'supports_credentials' => false,
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

];
