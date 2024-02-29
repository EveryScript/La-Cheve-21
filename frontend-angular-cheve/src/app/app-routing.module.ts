import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// Import del guardian de rutas
import { ShieldGuard } from "./services/shield.guard";
import { AuthenticatedGuard } from "./services/authenticated.guard";

//import layouts
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';//layoust
import { BasicLayoutComponent } from './layouts/basic-layout/basic-layout.component';//layout
// import components

import { LoginComponent } from "./components/login/login.component";
import { ErrorComponent } from "./components/error/error.component";
import { TablesComponent } from "./components/tables/tables.component";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { CookComponent } from "./components/cook/cook.component";
import { BarComponent } from "./components/bar/bar.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductEditComponent } from "./components/product-edit/product-edit.component";
import { TableListComponent } from "./components/table-list/table-list.component";
import { TableEditComponent } from "./components/table-edit/table-edit.component";
import { AccountComponent } from "./components/account/account.component";
import { ProductsComponent } from "./components/products/products.component";
import { TestingComponent } from "./components/testing/testing.component";
import { ReportsComponent } from "./components/reports/reports.component";
import { ReportsMonthComponent } from "./components/reports-product/reports-month.component";
import { ResumeAccountComponent } from "./components/resume-account/resume-account.component";
import { ResumeQrComponent } from "./components/resume-qr/resume-qr.component";
import { AccountUsedComponent } from "./components/account-used/account-used.component";
import { ControlPanelComponent } from './components/control-panel/control-panel.component';

const routes: Routes = [

  // Unauthenticated User Routes
  {
    path: '',
    component: BasicLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      //{ path: 'login', loadChildren: () => import('./routes/basic-routing/basic-routing.module').then(m => m.BasicRoutingModule) }
      { path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard]},
    ]
  },

  // Authenticated User Routes
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', loadChildren: () => import('./routes/default-routing/default-routing.module').then(m => m.DefaultRoutingModule), canActivate: [ShieldGuard] },
    
      { path: 'tables', component: TablesComponent, canActivate: [ShieldGuard] },  // Protected by Shield
      { path: 'cook', component: CookComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'bar', component: BarComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'admin', component: AdminComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'user-edit', component: UserEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'user-edit/:id/:mode', component: UserEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'user-list', component: UserListComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'product-list', component: ProductListComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'product-edit', component: ProductEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'product-edit/:id', component: ProductEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'table-list', component: TableListComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'table-edit', component: TableEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'table-edit/:id', component: TableEditComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'account/:id_table', component: AccountComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'account-used/:id_table', component: AccountUsedComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'resume/:id_table', component: ResumeAccountComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'products/:id_table/:id_account', component: ProductsComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'reports-gain', component: ReportsComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'reports-products', component: ReportsMonthComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'control-panel', component: ControlPanelComponent, canActivate: [ShieldGuard] }, // Protected by Shield
      { path: 'print-accounts', component: ResumeQrComponent },
      { path: 'testing', component: TestingComponent },
      { path: 'testing2', component: TestingComponent },
      { path: '**', component: ErrorComponent }

    ]
  },



];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
