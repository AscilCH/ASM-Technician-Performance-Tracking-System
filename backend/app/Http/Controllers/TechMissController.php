<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TechMiss;

class TechMissController extends Controller
{
    public function index()
    {
        $techMisses = TechMiss::all();
        return response()->json($techMisses);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_Tech' => 'required|exists:techniciens,id',
            'id_Miss' => 'required|exists:missions,id',
            'id_Ad' => 'required|exists:admins,id',
            'id_cl' => 'nullable|exists:clients,id',
        ]);

        $techMiss = TechMiss::create($validatedData);
        return response()->json(['message' => 'Tech Miss created successfully', 'data' => $techMiss], 201);
    }

    public function show($id)
    {
        $techMiss = TechMiss::findOrFail($id);
        return response()->json($techMiss);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'id_Tech' => 'required|exists:techniciens,id',
            'id_Miss' => 'required|exists:missions,id',
            'id_Ad' => 'required|exists:admins,id',
            'id_cl' => 'nullable|exists:clients,id',
        ]);

        $techMiss = TechMiss::findOrFail($id);
        $techMiss->update($validatedData);
        return response()->json(['message' => 'Tech Miss updated successfully', 'data' => $techMiss]);
    }

    public function destroy($id)
    {
        $techMiss = TechMiss::findOrFail($id);
        $techMiss->delete();
        return response()->json(['message' => 'Tech Miss deleted successfully']);
    }
}
