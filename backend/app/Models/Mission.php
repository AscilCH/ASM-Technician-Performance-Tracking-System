<?php
// app/Models/Mission.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mission extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'missions';

    protected $fillable = [
        'nom',
        'type',
        'DateDeb',
        'DateFin',
        'Difficulty',
        'Status'
    ];

    protected $dates = ['deleted_at'];

    public function techMisses()
    {
        return $this->hasMany(TechMiss::class, 'id_Miss');
    }
}
