// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
  }

  getUsers(): Observable<any> {
    return this.http.get('http://localhost:3000/users');
  }

  onUserDataChange(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('initialData', (data) => {
        observer.next(data);
      });

      this.socket.on('userCreated', (user) => {
        observer.next({ type: 'create', user });
      });

      this.socket.on('userUpdated', (user) => {
        observer.next({ type: 'update', user });
      });

      this.socket.on('userDeleted', (user) => {
        observer.next({ type: 'delete', user });
      });
    });
  }
}
