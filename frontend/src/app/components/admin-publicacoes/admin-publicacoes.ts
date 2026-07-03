import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-publicacoes',
  imports: [],
  templateUrl: './admin-publicacoes.html',
  styleUrl: './admin-publicacoes.css',
})
export class AdminPublicacoes implements OnInit{
  ngOnInit(): void {
    this.carregarPublicacoes();
    this.countPublicacoes();
  }

  constructor(
    private apiService: ApiService
  ){}

  publicacoes = signal<any[]>([]);
  countPublication = signal(0);

  countPublicacoes(){
    this.apiService.countPublications().subscribe((res) => this.countPublication.set(res.count));
  }

  deletePublication(publicationId: number){
    if(confirm('Tem certeza de que deseja apagar esta publicacao?'))
    this.apiService.deletePublication(publicationId).subscribe({
      next : () => {
        this.carregarPublicacoes();
      },
      error: (err) => {
        console.error('Erro ao eliminar publicacao');
      }
    })
  }

  carregarPublicacoes(){
    this.apiService.getPublications().subscribe({
      next: (data) => {
        try{
          const mapped = data.map((pub: any) => this.mapApiPublicationToPost(pub))
          .filter((pub:any) => pub !== null);
          this.publicacoes.set(mapped)
        }catch(e){
           console.error('Erro ao processar dados dos utilizadores:', e)
        }
      }
    })
  }

  formatDate = (date:Date) => {
    const d = date ? new Date(date) : new Date();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  mapApiPublicationToPost(pub:any){
    return {
      id: pub.id,
      texto: pub.texto,
      imagem: pub.imagem,
      video: pub.video,
      userName: pub.user?.nome || 'Utilizador',
      userEmail: pub.user?.email || '',
      userImg: pub.user?.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      data: this.formatDate(pub.created_at),
      bazes : pub.bazes_count,
      comments: pub.comments_count
    }
  }
}
