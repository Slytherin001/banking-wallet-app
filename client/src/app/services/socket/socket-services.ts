import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { OwnerService } from '../owner/owner-service';
import { NotificationService } from '../notification/notification-service';

@Injectable({
  providedIn: 'root',
})
export class SocketServices {
  private SOCKET_URL = 'http://localhost:5000';
  private socket!: Socket;

  private balanceSubject = new BehaviorSubject<number | null>(null);
  balance$ = this.balanceSubject.asObservable();

  // connect() {
  //   if (this.socket?.connected) return;

  //   this.socket = io(this.SOCKET_URL, {
  //     withCredentials: true,
  //   });

  //   this.socket.on('connect', () => {
  //     console.log('Connected to Socket.IO server: ', this.socket.id);
  //   });

  //   this.socket.on('balance-update', (balance: number) => {
  //     console.log('Balance Update: ', balance);
  //     this.balanceSubject.next(balance);
  //   });

  //   this.socket.on('disconnect', () => {
  //     console.log('Disconnected from Socket.IO server: ', this.socket.id);
  //   });
  // }

  constructor(
    private ownerService: OwnerService,
    private notificationService: NotificationService,
  ) {}

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(this.SOCKET_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket Connected:', this.socket.id);
    });

    this.socket.on('balance-update', (balance: number) => {
      console.log('Balance Update:', balance);
      this.balanceSubject.next(balance);
    });

    this.socket.on('notifications', (notify: any) => {
      this.notificationService.addNotification(notify);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket Error:', err.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket Disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined as any;
    }
  }
}
