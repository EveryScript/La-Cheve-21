<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
// Importing models
use App\User;
use App\order;
use App\account;

class ReportController extends Controller
{
    // Get just users Waiters
    public function getAccountsServed($date_start, $date_end) {
        // Add one day
        $date_end = date("Y-m-d", strtotime($date_end."+ 1 days"));

        // Select all WAITERS
        $waiters = User::where('role', 'WAITER')->select('id', 'name', 'surname')->get();
        if(is_object($waiters)) {
            // Add accounts amount
            foreach($waiters as $waiter) {
                $accounts_served = Account::join('users', 'accounts.user_id','users.id')
                    ->where('users.id', '=', $waiter->id)
                    ->where('accounts.updated_at', '>', $date_start)
                    ->where('accounts.updated_at', '<', $date_end)
                    ->select('users.id AS user_id', 'accounts.id AS account_id')
                    ->get();
                $waiter->accounts_amount = count($accounts_served);
                $waiter->accounts = $accounts_served;
            }

            foreach($waiters as $waiter) {
                if($waiter->accounts_amount > 0) {
                    foreach ($waiter->accounts as $account) {
                        $sum_gain_card = 0;
                        $orders = Order::join('accounts', 'orders.account_id', 'accounts.id')
                            ->join('products', 'orders.product_id', 'products.id')
                            ->join('users', 'accounts.user_id', 'users.id')
                            ->where('users.id', $account->user_id)
                            ->where('accounts.updated_at', '>', $date_start)
                            ->where('accounts.updated_at', '<', $date_end)
                            ->select('products.price', 'orders.amount', 'accounts.pay_method')
                            ->get();
                        $waiter->gains = $orders;
                    }
                }
            }
            
            $response = array(
                'status' => 'success',
                'code' => 200,
                'waiters' => $waiters
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Registros de mesero no encontrados'
            );
        }

        return response()->json($response, $response['code']);
    }

    // Get best waiters in the month by every date and total gain at date
    public function getBestWaitersInMonth($date_start, $date_end) {
        // Add one day
        if($date_start == $date_end) {
            $date_end = date("Y-m-d", strtotime($date_end."+ 1 days"));
        }

        $dates = Account::selectRaw("DATE_FORMAT(updated_at, '%Y-%m-%d') updated_day")
            ->where('updated_at', '>=', $date_start)
            ->where('updated_at', '<=', $date_end)
            ->groupBy('updated_day')
            ->get();

        if(is_object($dates)) {
            // Add gains all
            /*
                SELECT D.name, D.surname, A.amount, C.price, A.amount * C.price AS 'Ganancia', B.pay_method FROM orders A INNER JOIN accounts B ON A.account_id = B.id INNER JOIN products C ON A.product_id = C.id INNER JOIN users D ON B.user_id = D.id WHERE B.updated_at LIKE '2022-05-13%' ORDER BY (A.amount * C.price) DESC 
            */
            foreach($dates as $one_day) {
                $gain_card = Order::join('accounts', 'orders.account_id', 'accounts.id')
                    ->join('products', 'orders.product_id', 'products.id')
                    ->join('users', 'accounts.user_id', 'users.id')
                    ->where('accounts.updated_at', 'LIKE', $one_day->updated_day.'%')
                    ->select('users.id', 'users.name', 'users.surname', Order::raw('(products.price * orders.amount) AS total_gain'), 'accounts.pay_method')
                    ->orderBy('total_gain', 'DESC')
                    ->get();
                // Add every gain
                $total_gain_day_cash = 0;
                $total_gain_day_card = 0;
                foreach ($gain_card as $gain) {
                    if($gain->pay_method == 'CASH') {
                        $total_gain_day_cash += $gain->total_gain;
                    } else {
                        $total_gain_day_card += $gain->total_gain;
                    }
                }

                if(isset($gain_card[0])) {
                    $one_day->best_waiter = (string)($gain_card[0]->name.' '.$gain_card[0]->surname);
                    $one_day->total_gain_card = (string)$total_gain_day_card;
                    $one_day->total_gain_cash = (string)$total_gain_day_cash;
                    $one_day->total_gain = (string)($total_gain_day_card + $total_gain_day_cash);
                }
            }

            $total_all_cash = 0;  // Counter of all cash
            $total_all_card = 0;  // Counter of all card
            $total_all_prices = 0;  // Counter of all prices
            foreach($dates as $one_date) {
                $total_all_cash += $one_date->total_gain_cash;
                $total_all_card += $one_date->total_gain_card;
                $total_all_prices += $one_date->total_gain;
            }

            $response = array(
                'status' => 'success',
                'code' => 200,
                'total_cash' => (string)$total_all_cash,
                'total_card' => (string)$total_all_card,
                'total_all' => (string)$total_all_prices,
                'dates' => $dates
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Registros de mesero no encontrados'
            );
        }

        return response()->json($response, $response['code']);
    }

    // Get amount from all products sold
    public function getSoldProducts($date_start, $date_end) {
        if($date_start == $date_end) {
            $date_end = date("Y-m-d", strtotime($date_end."+ 1 days"));
        }

        $orders = Order::join('products', 'orders.product_id', 'products.id')
            ->where('orders.status', 'COMPLETED')
            ->where('orders.updated_at', '>=', $date_start)
            ->where('orders.updated_at', '<=', $date_end)
            ->select('orders.product_id', 'products.name', Order::raw('SUM(orders.amount) AS total_amount'))
            ->groupBy('orders.product_id')
            ->get();

        $response = array(
            'status' => 'success',
            'code' => 200,
            'orders' => $orders
        );

        return response()->json($response, $response['code']);
    }
}
