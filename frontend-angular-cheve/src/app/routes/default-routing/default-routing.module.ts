import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingRoutingModule } from './default-routing-routing.module';
import { WelcomeComponent } from '../../components/welcome/welcome.component';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    DefaultRoutingRoutingModule
  ]
})
export class DefaultRoutingModule { }
