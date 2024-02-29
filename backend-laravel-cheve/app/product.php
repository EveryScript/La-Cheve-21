<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Table name
    protected $table = 'products';

    // Principal fields
    protected $fillable = [
        'name', 'price', 'type'
    ];

    // Orders by product (1:N)
    public function orders() {
        return $this->hasMany('App\orders');
    }
}
