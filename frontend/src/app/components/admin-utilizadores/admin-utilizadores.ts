import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-utilizadores',
  imports: [],
  templateUrl: './admin-utilizadores.html',
  styleUrl: './admin-utilizadores.css',
})
export class AdminUtilizadores implements OnInit{
  constructor(
      private apiService: ApiService,
      private router: Router,
  )
  {}

  users = signal<any[]>([]);
  totUsers = signal(0);
  ngOnInit(): void {
    this.carregarUsers();
    this.getTotUsers();
  }

  getTotUsers(){
    this.apiService.countUsers().subscribe((res) => this.totUsers.set(res.count));
  }

  carregarUsers(){
    this.apiService.getUsers().subscribe({
      next: (data) => {
        try {
          const mapped = data
            .map((user: any) => this.mapApiUserToUser(user))
            .filter((user: any) => user !== null);

          this.users.set(mapped);
        } catch (e) {
          console.error('Erro ao processar dados dos utilizadores:', e);
        } finally {
        }
      },
      error: (err) => {
        console.error('Erro ao carregar utilizadores:', err);
      }
    });
  }

  deleteUser(userId: number){
    if(confirm('Tem certeza de que deseja apagar este user?')){
      this.apiService.deleteUser(userId).subscribe({
        next: () => {
          this.carregarUsers();
        },
        error: (err) => {
          console.error('Erro ao deletar usuario')
        }
      })
    }
  }

  formatDate = (date:Date) => {
    const d = date ? new Date(date) : new Date();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  mapApiUserToUser(user:any){
    return {
      id : user.id,
      nome: user.nome,
      email: user.email,
      data: this.formatDate(user.created_at),
      foto: user.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      count: user.publications_count,
      followers: user.followers_count
    };
  }
}
