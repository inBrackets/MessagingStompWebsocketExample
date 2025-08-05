import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WebsocketService} from './services/websocket.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular';
  greetings: string[] = [];
  name = '';

  websocketSrv = inject(WebsocketService)

  connect() {
    console.log('connecting...');
    this.websocketSrv.connect();
  }

  disconnect() {
    console.log('disconnected...');
    this.websocketSrv.disconnected();
  }

  send(nameInput: HTMLInputElement) {
    console.log('sending...');
    const name = nameInput.value;
    if (name.trim()) {
      this.websocketSrv.send({ name });
      this.showGreeting(name + "!!!");
      nameInput.value = '';  // clears the input box
    }
  }

  showGreeting(message: string) {
    this.greetings.push(message);
  }

  ngOnInit(): void {
  }
}
