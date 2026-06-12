import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  searchQuery = '';
  users = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.search(); // load initial list or empty search
  }

  search() {
    this.loading.set(true);
    this.apiService.searchUsers(this.searchQuery).subscribe({
      next: (data) => {
        this.users.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao pesquisar utilizadores:', err);
        this.loading.set(false);
      }
    });
  }

  toggleFollow(user: any) {
    if (user.is_following) {
      this.apiService.unfollowUser(user.id).subscribe({
        next: () => {
          this.users.update(currentUsers => 
            currentUsers.map(u => u.id === user.id ? { ...u, is_following: false } : u)
          );
        },
        error: (err) => {
          alert(err.error?.error || 'Erro ao deixar de seguir.');
        }
      });
    } else {
      this.apiService.followUser(user.id).subscribe({
        next: () => {
          this.users.update(currentUsers => 
            currentUsers.map(u => u.id === user.id ? { ...u, is_following: true } : u)
          );
        },
        error: (err) => {
          alert(err.error?.error || 'Erro ao seguir.');
        }
      });
    }
  }

  verPerfil(id: number) {
    this.router.navigate(['/perfil', id]);
  }
}
