<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|unique:admins,email|max:255',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'photo' => 'required|string',
        ]);

        $validatedData['photo'] = $request->get('photo');
        $validatedData['password'] = Hash::make($validatedData['password']);
        $admin = Admin::create($validatedData);
        return response()->json(['message' => 'Admin created successfully'], 201);
    }

    public function show($id)
    {
        $admin = Admin::findOrFail($id);
        return response()->json($admin);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255|unique:admins,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'photo' => 'required|string',
        ]);

        if ($request->has('password')) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        // Debug: Log the validated data
        \Log::info('Validated Data: ', $validatedData);

        $admin = Admin::findOrFail($id);

        // Debug: Log the current admin data before update
        \Log::info('Current Admin Data: ', $admin->toArray());

        $admin->update($validatedData);

        // Debug: Log the admin data after update
        \Log::info('Updated Admin Data: ', $admin->toArray());

        return response()->json(['message' => 'Admin updated successfully']);
    }

    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
