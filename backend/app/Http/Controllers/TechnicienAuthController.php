<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Technicien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TechnicienAuthController extends Controller
{
    public function register(Request $request)
    {
        // Valider la requête entrante
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:techniciens',
            'password' => 'required|string|min:8|confirmed',
            'score' => 'required|integer',
            'type' => 'required|in:installation,integration,SAV',
            'photo' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Créer un nouveau technicien
        $technicien = Technicien::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'score' => $request->score,
            'type' => $request->type,
            'photo' => $request->photo,
        ]);

        // Créer un token d'authentification pour le technicien
        $token = $technicien->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function login(Request $request)
    {
        // Valider la requête entrante
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tenter de connecter le technicien
        if (!Auth::guard('technicien')->attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Récupérer le technicien authentifié
        $technicien = Auth::guard('technicien')->user();
        // Créer un token d'authentification pour le technicien
        $token = $technicien->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer','tech_id' => $technicien->id]);
    }

    public function logout()
    {
        // Supprimer tous les tokens de l'utilisateur authentifié
        Auth::guard('technicien-api')->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile()
    {
        // Récupérer et renvoyer les informations du technicien authentifié
        return response()->json(Auth::guard('technicien-api')->user());
    }
}
