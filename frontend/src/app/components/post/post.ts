import { Component, input, output, inject, signal } from '@angular/core';
import { Comentarios } from '../comentarios/comentarios';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [Comentarios, CommonModule, FormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  private apiService = inject(ApiService);

  dataPost = input.required<{
    id: number;
    userId?: number;
    text: string;
    image?: string;
    video?: string;
    userName: string;
    userEmail: string;
    userImg: string;
    date: Date;
    likes: number;
  }>();

  deleted = output<void>();

  currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  verComentarios = signal(false);
  editing = signal(false);
  editText = '';

  isOwnPost(): boolean {
    return this.dataPost().userId === this.currentUser.id;
  }

  deletePost() {
    if (confirm('Tem certeza de que deseja apagar esta publicação?')) {
      this.apiService.deletePublication(this.dataPost().id).subscribe({
        next: () => {
          this.deleted.emit();
        },
        error: (err) => {
          alert(err.error?.error || 'Erro ao apagar publicação.');
        }
      });
    }
  }

  startEdit() {
    this.editing.set(true);
    this.editText = this.dataPost().text;
  }

  saveEdit() {
    if (!this.editText.trim()) return;
    this.apiService.updatePublication(this.dataPost().id, { texto: this.editText }).subscribe({
      next: () => {
        this.editing.set(false);
        this.deleted.emit();
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao editar publicação.');
      }
    });
  }

  SetverComentarios(){
    this.verComentarios.update(v => !v);
  }
  calcularTempoPublicacao(data: Date): string {
    const agora = new Date();
    const diferenca = agora.getTime() - new Date(data).getTime();
    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) {
      return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (minutos > 0) {
      return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else {
      return `Há ${segundos} segundo${segundos > 1 ? 's' : ''}`;
    }
  }

}
