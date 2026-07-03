import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-comentarios',
  imports: [],
  templateUrl: './admin-comentarios.html',
  styleUrl: './admin-comentarios.css',
})
export class AdminComentarios implements OnInit{
  constructor(
    private apiService: ApiService
  ){}

  comentarios = signal<any[]>([]);
  totCometarios = signal(0);

  ngOnInit(): void {
    this.carregarComentarios();
    this.contarComentarios();
  }

  carregarComentarios(){
    this.apiService.getCommentsAll().subscribe({
      next : (data) => {
        try{
          const commentsArray = data.map((comment:any) => this.mapApiCommentToComment(comment))
          .filter((comment:any) => comment !== null);
          this.comentarios.set(commentsArray);
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

  mapApiCommentToComment(comment:any){
    let nome = signal('');
    this.apiService.getUser(comment.publication.user_id).subscribe((res:any) => nome.set(res.nome))
    return {
      id: comment.id,
      userName: comment.user?.nome || 'Utilizador',
      userEmail: comment.user?.email || '',
      userImg: comment.user?.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      texto: comment.texto,
      pubUser : nome ,
      data: this.formatDate(comment.created_at)
    }
  }

  deletComment(commentId: number){
    if(confirm('Deseja deletar este comentario?'))
    this.apiService.deleteComment(commentId).subscribe({
      next: () => {
        this.carregarComentarios();
      },
      error: (err) =>{
         console.error('Erro ao eliminar publicacao',err);
      }
    })
  }

  contarComentarios(){
    this.apiService.countComments().subscribe((res) => this.totCometarios.set(res.count));
  }
}
