<?php

// Users model

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable. @var array
     */
    protected $fillable = [
        //'name', 'email', 'password',
        'name', 'surname', 'role', 'email', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays. @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Accounts by users (1:N)
    public function accounts() {
        return $this->hasMany('App\accounts');
    }
}
