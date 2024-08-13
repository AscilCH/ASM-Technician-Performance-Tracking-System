<?php
// app/Models/Reclamation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reclamation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'technicien_id',
        'titre',
        'description',
        'image',
    ];

    protected $dates = ['deleted_at'];

    public function technicien()
    {
        return $this->belongsTo(Technicien::class,'technicien_id');
    }

    public function imageReclamations()
    {
        return $this->hasMany(ImageReclamation::class);
    }
}
