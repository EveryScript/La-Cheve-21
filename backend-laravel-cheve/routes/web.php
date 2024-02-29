<?php

use Illuminate\Support\Facades\Route;
// +++ Load Middleware +++
use App\Http\Middleware\AuthorizationMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
 
/* More QueryBuilders: https://desarrollowebtutorial.com/laravel-eloquent-orm-query-builder-consultas-sql/ */

Route::get('/', function () {
    return view('welcome');
});

// Ruta de prueba
// Route::get('/mi-prueba', 'PruebaController@prueba');
// Route::post('devolver', 'PruebaController@devolver_datos');

/* --- PRODUCTS --- */
Route::resource('product', 'ProductController'); // (AUTO)
// Upload image
Route::post('/product/upload-image', 'ProductController@upload')->middleware(AuthorizationMiddleware::class);
// Get image product
Route::get('/product/get-image/{filename}', 'ProductController@getImage');
// Get products by type
Route::get('/product/get-by-type/{type}', 'ProductController@getProductsByType');
// Search product by word
Route::get('/product/search/{key}', 'ProductController@searchProduct');



/* --- TABLES --- */
Route::resource('table', 'TableController');
// Get tables by area_name
Route::get('/table/get-by-area/{area}', 'TableController@showByArea');
// Get all areas
Route::get('/tables/get-all-areas', 'TableController@getAllAreas');



/* --- ACCOUNTS --- */
Route::resource('account', 'AccountController'); 
// Get accounts by id_table
Route::get('/account/get-by-table/{id}', 'AccountController@getAccountByTable');
// Get active accounts from MENU
Route::get('/accounts/get-menu-orders/{order_status}', 'AccountController@getMenuOrdersByUser');
// Get active accounts from BAR
Route::get('/accounts/get-bar-orders/{order_status}', 'AccountController@getBarOrdersByUser');
// Get today accounts (to Print)
Route::get('/accounts/get-print-today', 'AccountController@getTodayAccounts');



/* --- ORDERS --- */
Route::resource('order', 'OrderController');
// Update orders by account id
Route::put('/orders/{id}/{type}', 'OrderController@updateOrder');
// Get orders by id_account
Route::get('/order/get-by-account/{id}', 'OrderController@showByAccount');
// Get orders by table with account status (ACTIVE/FINISHED)
Route::get('/order/get-by-table/{id}/{status}', 'OrderController@showByTable');  // <- Ideal to waiters 



/* --- REPORTS --- */
// Get gains of the waiters 
Route::get('/report/get-served-gain/{date_start}/{date_end}', 'ReportController@getAccountsServed');
// Get best waiters in every day of the month
Route::get('/report/get-best-month/{date_start}/{date_end}', 'ReportController@getBestWaitersInMonth');
// Get sum products sold and description
Route::get('/report/get-sold-products/{date_start}/{date_end}', 'ReportController@getSoldProducts'); //->middleware(AuthorizationMiddleware::class);



/* --- USERS --- */
// Login user
Route::post('/user/login', 'UserController@login');
// Save user
Route::post('/user/save', 'UserController@save');
// Get all users
Route::get('/users', 'UserController@all');
// Get one user
Route::get('/user/{id}', 'UserController@user');
// Upload avatar
Route::post('/user/upload-avatar', 'UserController@uploadAvatar')->middleware(AuthorizationMiddleware::class);
// Get avatar
Route::get('/user/get-avatar/{filename}', 'UserController@getAvatar');
// Update user
Route::put('/user', 'UserController@update');


/*  */