<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'match_date',
        'winner',
        'turtle_taken',
        'lord_taken',
        'notes',
        'playstyle'
    ];

    // Relationship to teams
    public function teams()
    {
        return $this->hasMany(MatchTeam::class, 'match_id');
    }
}