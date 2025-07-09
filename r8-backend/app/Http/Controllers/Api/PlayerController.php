<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Player;

class PlayerController extends Controller
{
    public function uploadPhoto(Request $request, $playerId)
    {
        $request->validate([
            'photo' => 'required|image|max:2048', // 2MB max
        ]);

        $player = Player::findOrFail($playerId);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('players'), $filename);
            $player->photo = 'players/' . $filename;
            $player->save();
        }

        return response()->json(['photo' => url($player->photo)], 200);
    }

    public function uploadPhotoByName(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048', // 2MB max
            'playerName' => 'required|string',
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $playerName = preg_replace('/[^A-Za-z0-9_-]/', '', $request->input('playerName'));
            $filename = $playerName . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('players'), $filename);
            $photoPath = 'players/' . $filename;

            // Find or create the player by name
            $player = \App\Models\Player::firstOrCreate(
                ['name' => $request->input('playerName')],
                ['role' => null]
            );
            $player->photo = $photoPath;
            $player->save();

            $photoUrl = url($photoPath);
            return response()->json([
                'photo' => $photoUrl,
                'player' => $player
            ], 200);
        }

        return response()->json(['error' => 'No photo uploaded'], 400);
    }

    public function index()
    {
        return Player::all();
    }

    public function heroStats($playerName)
    {
        // Get all match_teams joined with matches
        $matchTeams = \App\Models\MatchTeam::with('match')->get();
        $heroStats = [];

        foreach ($matchTeams as $team) {
            $match = $team->match;
            $isWin = $team->team === $match->winner;
            // Combine picks1 and picks2
            $picks = array_merge($team->picks1 ?? [], $team->picks2 ?? []);
            foreach ($picks as $pick) {
                // Support both {hero, player} and just hero string
                if (is_array($pick) && isset($pick['hero']) && isset($pick['player']) && strtolower($pick['player']) === strtolower($playerName)) {
                    $hero = $pick['hero'];
                } elseif (is_string($pick) && strtolower($pick) === strtolower($playerName)) {
                    $hero = $pick;
                } else {
                    continue;
                }
                if (!isset($heroStats[$hero])) {
                    $heroStats[$hero] = ['win' => 0, 'lose' => 0, 'total' => 0];
                }
                $heroStats[$hero]['total']++;
                if ($isWin) {
                    $heroStats[$hero]['win']++;
                } else {
                    $heroStats[$hero]['lose']++;
                }
            }
        }
        // Calculate winrate
        $result = [];
        foreach ($heroStats as $hero => $stat) {
            $rate = $stat['total'] > 0 ? round($stat['win'] / $stat['total'] * 100) : 0;
            $result[] = [
                'hero' => $hero,
                'win' => $stat['win'],
                'lose' => $stat['lose'],
                'total' => $stat['total'],
                'winrate' => $rate
            ];
        }
        // Sort by total desc
        usort($result, function($a, $b) { return $b['total'] <=> $a['total']; });
        return response()->json($result);
    }
}