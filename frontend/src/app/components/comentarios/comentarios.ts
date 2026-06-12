import { Component, input, inject, OnInit } from '@angular/core';
import { calcularTempoPublicacao } from '../../utils/utils';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css',
})
export class Comentarios implements OnInit {
  private apiService = inject(ApiService);

  postId = input.required<number>();
  comentarios: any[] = [];
  novoComentarioTexto = '';
  currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  ngOnInit() {
    this.carregarComentarios();
  }

  carregarComentarios() {
    const id = this.postId();
    if (!id) return;
    this.apiService.getComments(id).subscribe({
      next: (data) => {
        this.comentarios = data.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          userName: c.user?.nome || 'Utilizador',
          userEmail: c.user?.email || '',
          userImg: c.user?.foto_perfil ? `http://localhost:8000/storage/${c.user.foto_perfil}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          text: c.texto,
          date: new Date(c.created_at)
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar comentários:', err);
      }
    });
  }

  enviarComentario() {
    if (!this.novoComentarioTexto.trim()) return;
    const id = this.postId();
    this.apiService.addComment(id, this.novoComentarioTexto).subscribe({
      next: () => {
        this.novoComentarioTexto = '';
        this.carregarComentarios();
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao adicionar comentário.');
      }
    });
  }

  apagarComentario(commentId: number) {
    if (confirm('Tem certeza de que deseja apagar este comentário?')) {
      this.apiService.deleteComment(commentId).subscribe({
        next: () => {
          this.carregarComentarios();
        },
        error: (err) => {
          alert(err.error?.error || 'Erro ao apagar comentário.');
        }
      });
    }
  }

  isOwnComment(comment: any): boolean {
    return comment.userId === this.currentUser.id;
  }

  calcularTempoPublicacao(data: Date): string {
    return calcularTempoPublicacao(data);
  }
}
