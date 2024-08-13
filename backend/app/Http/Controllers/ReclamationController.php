<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;

class ReclamationController extends Controller
{
    public function index()
    {
        $reclamations = Reclamation::all();
        return response()->json($reclamations);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'technicien_id' => 'required|integer|exists:techniciens,id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|string', // Change validation rule to accept string
        ]);

        $reclamation = new Reclamation([
            'technicien_id' => $request->get('technicien_id'),
            'titre' => $request->get('titre'),
            'description' => $request->get('description'),
            'image' => $request->get('image'), // Directly save the image name
        ]);

        $reclamation->save();

        return response()->json(['message' => 'Reclamation created successfully'], 201);
    }

    public function show($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        return response()->json($reclamation);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'technicien_id' => 'required|integer|exists:techniciens,id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|string',
        ]);

        $reclamation = Reclamation::findOrFail($id);
        $reclamation->update($validatedData);

        return response()->json(['message' => 'Reclamation updated successfully']);
    }

    public function destroy($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        $reclamation->delete();

        return response()->json(['message' => 'Reclamation deleted successfully']);
    }

    public function getReclamationsByTechnician($id)
    {
        $reclamations = Reclamation::where('technicien_id', $id)->get();
        return response()->json($reclamations);
    }
}
