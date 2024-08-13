<?php
// app/Models/TechMiss.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TechMiss extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'id_Tech',
        'id_Miss',
        'id_Ad',
        'id_cl',
    ];

    protected $dates = ['deleted_at'];

    public function technicien()
    {
        return $this->belongsTo(Technicien::class, 'id_Tech');
    }

    public function mission()
    {
        return $this->belongsTo(Mission::class, 'id_Miss');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_Ad');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'id_cl');
    }
}
