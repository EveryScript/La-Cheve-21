<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    // Table name
    protected $table = 'tables';

    // Principal fields
    protected $filiable = [
        'table_name', 'area_name'
    ];

    // Accounts by table (1:N)
    public function accounts() {
        return $this->hasMany('App\accounts');
    }
}
