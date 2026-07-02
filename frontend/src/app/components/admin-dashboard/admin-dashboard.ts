import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
  constructor(
    private apiService: ApiService,
    private router: Router,
  )
  {}
  totUsers = signal(0);
  totPublicacoes = signal(0);
  totComentarios = signal(0);
  users = signal<any[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.getCountUsers();
    this.getCountComments();
    this.getCountPublications();
    this.carregarUsersWithCount();
  }
  getCountUsers(){
    this.apiService.countUsers().subscribe(
      (res:any) => {
        this.totUsers.set(res.count);
      }
    )
  }

  getCountComments(){
    this.apiService.countComments().subscribe(
      (res:any) => {
        this.totComentarios.set(res.count);
      }
    )
  }

  getCountPublications(){
    this.apiService.countPublications().subscribe(
      (res:any) => {
        this.totPublicacoes.set(res.count);
        console.log(this.totPublicacoes);
      }
    )
  }

  carregarUsersWithCount() {
    this.loading.set(true);

    this.apiService.getUserWithCountPublications().subscribe({
      next: (data) => {
        try {
          const mapped = data
            .map((user: any) => this.mapApiUserToUser(user))
            .filter((user: any) => user !== null);

          this.users.set(mapped);
        } catch (e) {
          console.error('Erro ao processar dados dos utilizadores:', e);
        } finally {
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar utilizadores:', err);
        this.loading.set(false);
      }
    });
  }

  mapApiUserToUser(user: any) {
    if (!user) return null;

    return {
      id : user.id,
      nome: user.nome,
      foto: user.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      count: user.publications_count,
      followers: user.followers_count
    };
  }
}
