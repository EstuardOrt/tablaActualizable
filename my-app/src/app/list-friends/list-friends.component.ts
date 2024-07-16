import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-friends',
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.css'
})
export class ListFriendsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'gender'];
  dataSource = new MatTableDataSource();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.dataSource.data = data;
    });

    this.userService.onUserDataChange().subscribe(change => {
      this.handleUserChange(change);
    });
  }

  handleUserChange(change: { type: any; user: { id: any; }; }) {
    const data = this.dataSource.data as any[];

    switch (change.type) {
      case 'create':
        data.push(change.user);
        break;
      case 'update':
        const index = data.findIndex(item => item.id === change.user.id);
        if (index !== -1) {
          data[index] = change.user;
        }
        break;
      case 'delete':
        this.dataSource.data = data.filter(item => item.id !== change.user.id);
        return; // Ya hemos actualizado la fuente de datos, no necesitamos hacer nada más
    }

    this.dataSource.data = data; // Actualizar la fuente de datos de la tabla
  }
}