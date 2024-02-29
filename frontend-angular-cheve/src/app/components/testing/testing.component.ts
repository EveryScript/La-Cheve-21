import { Component, OnInit } from '@angular/core';
// Importing moment.js
import * as moment from 'moment'; moment.locale("es");

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css'],
  providers: [  ]
})
export class TestingComponent implements OnInit {
  // Propiedades
  constructor(){
  }
  
  ngOnInit(): void {
    console.warn('component testing initi')
  }
}
