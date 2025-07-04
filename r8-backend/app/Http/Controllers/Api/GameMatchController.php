<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\MatchTeam;
use Illuminate\Http\Request;

class GameMatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all matches with their teams
        $matches = \App\Models\GameMatch::with('teams')->orderBy('match_date', 'desc')->get();
        return response()->json($matches);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'match_date' => 'required|date',
            'winner' => 'required|string',
            'turtle_taken' => 'nullable|integer',
            'lord_taken' => 'nullable|integer',
            'notes' => 'nullable|string',
            'playstyle' => 'nullable|string',
            'teams' => 'required|array|size:2',
            'teams.*.team' => 'required|string',
            'teams.*.team_color' => 'required|in:blue,red',
            'teams.*.banning_phase1' => 'required|array',
            'teams.*.picks1' => 'required|array',
            'teams.*.banning_phase2' => 'required|array',
            'teams.*.picks2' => 'required|array',
        ]);

        // Create the match
        $match = GameMatch::create([
            'match_date' => $validated['match_date'],
            'winner' => $validated['winner'],
            'turtle_taken' => $validated['turtle_taken'] ?? null,
            'lord_taken' => $validated['lord_taken'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'playstyle' => $validated['playstyle'] ?? null,
        ]);

        // Defensive: Only create teams if present and is array
        if (isset($validated['teams']) && is_array($validated['teams'])) {
            foreach ($validated['teams'] as $teamData) {
                $teamData['match_id'] = $match->id;
                MatchTeam::create($teamData);
            }
        }

        return response()->json(['message' => 'Match and teams saved successfully.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
