import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [FormsModule],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  private apiService = inject(ApiService);
  email = '';

  recuperar(event: Event) {
    event.preventDefault();
    this.apiService.forgotPassword(this.email).subscribe({
      next: (res) => {
        alert(res.message || "Link de recuperação enviado com sucesso!");
      },
      error: (err) => {
        alert(err.error?.message || "Erro ao solicitar recuperação de senha.");
      }
    });
  }
}
