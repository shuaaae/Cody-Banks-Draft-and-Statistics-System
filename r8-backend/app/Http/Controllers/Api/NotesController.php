<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class NotesController extends Controller
{
    /**
     * Get all notes for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $notes = Auth::user()->notes()->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Store a new note.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            $note = Auth::user()->notes()->create([
                'title' => $validated['title'],
                'content' => $validated['content'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note saved successfully',
                'data' => $note
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save note'
            ], 500);
        }
    }

    /**
     * Update a note.
     */
    public function update(Request $request, Note $note): JsonResponse
    {
        // Check if the note belongs to the authenticated user
        if ($note->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            $note->update([
                'title' => $validated['title'],
                'content' => $validated['content'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Note updated successfully',
                'data' => $note
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update note'
            ], 500);
        }
    }

    /**
     * Delete a note.
     */
    public function destroy(Note $note): JsonResponse
    {
        // Check if the note belongs to the authenticated user
        if ($note->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Note deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete note'
            ], 500);
        }
    }
} 