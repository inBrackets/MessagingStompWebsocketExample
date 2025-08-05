import { Injectable } from '@angular/core';
import {Client, Message, Stomp} from '@stomp/stompjs';
import {BehaviorSubject, Subject} from 'rxjs';
import {Greeting} from '../model/master.model';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  stompClient: any;  // STOMP client instance to handle WebSocket connection

  topic: string = "/topic/greetings";
  responseSubject = new Subject<Greeting>()
  websocketEndpoint: string = "http://localhost:8080/gs-guide-websocket";

  connect() {
    console.log("Initialize Websocket Connection");
    let ws = SockJS(this.websocketEndpoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient?.subscribe(_this.topic, function (greetingResponse: any) {
        _this.onMessageReceived(greetingResponse);
      });
    }, this.errorCallBack);
  };

  disconnected() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
   * Send message to server via websocket
   * @param {*} message
   */
  send(message: { name: string }) {
    console.log("calling logout api via web socket)");
    this.stompClient.send("/app/hello", {}, JSON.stringify(message));

  }

  onMessageReceived(message: any) {
    console.log("Message Received from Server:: ", message.body);
    const obj = JSON.parse(message.body) as Greeting;
    this.responseSubject.next(obj);
  }
}
