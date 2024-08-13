<?php
return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver' => 'sanctum',  // Utiliser Sanctum pour l'authentification API
            'provider' => 'admins', // Assurez-vous que cela correspond à votre configuration de fournisseur
        ],

        'technicien' => [
            'driver' => 'session',
            'provider' => 'techniciens',
        ],

        'technicien-api' => [
            'driver' => 'sanctum', // Utiliser Sanctum pour les tokens API
            'provider' => 'techniciens',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Admin::class,  // Assurez-vous que cela pointe vers votre modèle Admin
        ],

        'techniciens' => [
            'driver' => 'eloquent',
            'model' => App\Models\Technicien::class, // Assurez-vous que cela pointe vers votre modèle Technicien
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
        ],

        'techniciens' => [
            'provider' => 'techniciens',
            'table' => 'password_resets',
            'expire' => 60,
        ],
    ],

    'password_timeout' => 10800,

];
