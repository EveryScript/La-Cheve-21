<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    // Table name
    protected $table = 'accounts';

    // Principal fields
    protected $fillable = [
        'status', 'pay_method'
    ];

    // Orders by account (1:N)
    public function orders() {
        return $this->hasMany('App\orders');
    }

    // Orders by accounts
    public function user() {
        return $this->belongsTo('App\User', 'user_id');
    }

    // Orders by products
    public function table() {
        return $this->belongsTo('App\table', 'table_id');
    }
}
