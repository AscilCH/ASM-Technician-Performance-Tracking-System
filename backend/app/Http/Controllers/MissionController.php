<?php
namespace App\Http\Controllers;

use App\Models\TechMiss;
use Illuminate\Http\Request;
use App\Models\Mission;

class MissionController extends Controller
{
    public function index()
    {
        $missions = Mission::all();
        return response()->json($missions);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:installation,integration',
            'DateDeb' => 'required|date',
            'DateFin' => 'required|date',
            'Difficulte' => 'required|integer',
            'Status' => 'required|in:en attente,en execution,executé,expiré',
        ]);

        $mission = Mission::create($validatedData);
        return response()->json(['message' => 'Mission created successfully'], 201);
    }

    public function show($id)
    {
        $mission = Mission::findOrFail($id);
        return response()->json($mission);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:installation,integration',
            'DateDeb' => 'required|date',
            'DateFin' => 'required|date',
            'Difficulté' => 'required|integer',
            'Status' => 'required|in:en attente,en execution,executé,expiré',
        ]);

        $mission = Mission::findOrFail($id);
        $mission->update($validatedData);
        return response()->json(['message' => 'Mission updated successfully']);
    }

    public function destroy($id)
    {
        $mission = Mission::findOrFail($id);
        $mission->delete();
        return response()->json(['message' => 'Mission deleted successfully']);
    }
    public function getMissionsByTechnician($id)
    {
        // Fetch the missions assigned to the technician with the given id
        $missions = TechMiss::where('id_Tech', $id)
            ->with('mission')
            ->get()
            ->map(function($techMiss) {
                return $techMiss->mission;
            });

        // Return the list of missions as a JSON response
        return response()->json($missions);
    }
}
