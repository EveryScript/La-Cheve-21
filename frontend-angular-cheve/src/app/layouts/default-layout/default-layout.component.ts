import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css'],
  providers: [WebSocketService]
})
export class DefaultLayoutComponent implements OnInit {
  constructor(private _socket: WebSocketService,) { }

  ngOnInit(): void {
  }

}
