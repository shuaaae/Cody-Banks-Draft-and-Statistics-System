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

    public function index()
    {
        return Player::all();
    }
}