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
<<<<<<< HEAD
        'playstyle',
        'team_id'
=======
        'playstyle'
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
    ];

    // Relationship to teams
    public function teams()
    {
        return $this->hasMany(MatchTeam::class, 'match_id');
    }
<<<<<<< HEAD

    // Relationship to the team that created this match
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
=======
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
}