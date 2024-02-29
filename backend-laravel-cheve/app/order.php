<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // Table name
    protected $table = 'orders';

    // Principal fields
    protected $fillable = [
        'amount', 'status'
    ];

    // Orders by accounts
    public function account() {
        return $this->belongsTo('App\account', 'account_id');
    }

    // Orders by products
    public function product() {
        return $this->belongsTo('App\product', 'product_id');
    }
}
