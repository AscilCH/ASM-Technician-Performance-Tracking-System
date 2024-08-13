<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Technicien;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TechnicienController extends Controller
{
    /**
     * Display a listing of the techniciens.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $techniciens = Technicien::all();
        return response()->json($techniciens);
    }

    /**
     * Store a newly created technicien in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the form data
        $validatedData = $request->validate([
            'email' => 'required|email|unique:techniciens,email|max:255',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'score' => 'required|integer',
            'type' => 'required|in:installation,integration,SAV',
            'photo' => 'required|string',
        ]);

        $technicien = new Technicien();
        $technicien->email = $validatedData['email'];
        $technicien->password = bcrypt($validatedData['password']);
        $technicien->first_name = $validatedData['first_name'];
        $technicien->last_name = $validatedData['last_name'];
        $technicien->score = $validatedData['score'];
        $technicien->type = $validatedData['type'];
        $technicien->photo = $request->get('photo');

        // Save the technicien instance
        $technicien->save();

        // Return response indicating success
        return response()->json(['message' => 'Technicien created successfully'], 201);
    }

    public function uploadPhoto(Request $request)
    {
        Log::info('Upload request received', $request->all());

        $request->validate([
            'photo' => 'required|file|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            Log::info('File details', [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType()
            ]);

            // Get the original filename without the extension
            $filenameWithoutExt = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = $filenameWithoutExt . '.' . $extension;

            $filePath = public_path('image');
            Log::info('Moving file to: ' . $filePath);

            // Check if directory exists
            if (!file_exists($filePath)) {
                Log::info('Directory does not exist, creating: ' . $filePath);
                if (mkdir($filePath, 0777, true)) {
                    Log::info('Directory created successfully');
                } else {
                    Log::error('Failed to create directory: ' . $filePath);
                    return response()->json(['error' => 'Failed to create directory'], 500);
                }
            } else {
                Log::info('Directory already exists: ' . $filePath);
            }

            // Attempt to move the file
            if ($file->move($filePath, $filename)) {
                Log::info('File successfully moved to: ' . $filePath . '/' . $filename);
                // Return filename without the extension
                return response()->json(['filename' => $filenameWithoutExt], 200);
            } else {
                Log::error('Failed to move file to: ' . $filePath);
                return response()->json(['error' => 'Failed to move file'], 500);
            }
        }

        Log::error('No file found in the request');
        return response()->json(['error' => 'File upload failed'], 500);
    }


    /**
     * Display the specified technicien.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $technicien = Technicien::findOrFail($id);
        return response()->json($technicien);
    }

    /**
     * Update the specified technicien in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTechnicianProfile(Request $request, $id)
    {
        Log::info('Update request received', $request->all());

        $technician = Technicien::findOrFail($id);

        // Remove .jpg extension if present
        $photo = $request->input('photo');
        if ($photo) {
            $photo = pathinfo($photo, PATHINFO_FILENAME); // Remove extensio
        }

        $technician->update([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'type' => $request->input('type'),
            'score' => $request->input('score'),
            'photo' => $photo // Store filename without extension
        ]);

        Log::info('Technician profile updated successfully', $technician);

        return response()->json($technician, 200);
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'type' => 'required|string',
            'score' => 'required|integer',
            'photo' => 'nullable|string',
        ]);

        // Find the technicien by ID
        $technicien = Technicien::findOrFail($id);

        // Update technicien data
        $technicien->email = $validatedData['email'];

        if ($request->has('password')) {
            $technicien->password = bcrypt($validatedData['password']);
        }

        $technicien->first_name = $validatedData['first_name'];
        $technicien->last_name = $validatedData['last_name'];
        $technicien->score = $validatedData['score'];
        $technicien->type = $validatedData['type'];
        $technicien->photo = $request->get('photo');

        $technicien->save();

        // Return JSON response with success message and status code
        return response()->json(['message' => 'Technicien updated successfully']);
    }

    /**
     * Remove the specified technicien from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $technicien = Technicien::findOrFail($id);
        $technicien->delete();

        return response()->json(['message' => 'Technicien deleted successfully']);
    }
}
