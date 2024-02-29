import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Import de Routing manual
import { routing, appRoutingProviders } from './app.routing';
// Import de cliente HTTP
import { HttpClientModule } from '@angular/common/http';
// Import de formularios (DataBinding)
import { FormsModule } from '@angular/forms';
// Guardian de rutas Shield
import { ShieldGuard } from './services/shield.guard';
import { AuthenticatedGuard } from './services/authenticated.guard';
import { UserService } from './services/user.service';

// Imports de componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ErrorComponent } from './components/error/error.component';
import { TablesComponent } from './components/tables/tables.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CookComponent } from './components/cook/cook.component';
import { BarComponent } from './components/bar/bar.component';
import { AdminComponent } from './components/admin/admin.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableEditComponent } from './components/table-edit/table-edit.component';
import { AccountComponent } from './components/account/account.component';
import { ProductsComponent } from './components/products/products.component';
import { TestingComponent } from './components/testing/testing.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportsMonthComponent } from './components/reports-product/reports-month.component';
import { ResumeAccountComponent } from './components/resume-account/resume-account.component';
import { ResumeQrComponent } from './components/resume-qr/resume-qr.component';
import { AccountUsedComponent } from './components/account-used/account-used.component';
import { BasicLayoutComponent } from './layouts/basic-layout/basic-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
//import { WelcomeComponent } from './components/welcome/welcome.component';
//module routin
import { AppRoutingModule } from './app-routing.module';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ErrorComponent,
    TablesComponent,
    UserEditComponent,
    UserListComponent,
    CookComponent,
    BarComponent,
    AdminComponent,
    HeaderComponent,
    ProductListComponent,
    ProductEditComponent,
    TableListComponent,
    TableEditComponent,
    AccountComponent,
    ProductsComponent,
    TestingComponent,
    ReportsComponent,
    ReportsMonthComponent,
    ResumeAccountComponent,
    ResumeQrComponent,
    AccountUsedComponent,
    BasicLayoutComponent,
    DefaultLayoutComponent,
    ControlPanelComponent,
    //WelcomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    routing,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    //appRoutingProviders,
    ShieldGuard,
    AuthenticatedGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
