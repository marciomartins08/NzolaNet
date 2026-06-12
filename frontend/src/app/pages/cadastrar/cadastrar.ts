import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css',
})
export class Cadastrar {
  private apiService = inject(ApiService);
  private router = inject(Router);

  nome = '';
  email = '';
  password = '';
  confirm = '';

  submeterDados(event: any) {
    event.preventDefault();
    if (this.password !== this.confirm) {
      alert("As senhas não coincidem!");
      return;
    }

    this.apiService.register({
      nome: this.nome,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res) => {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || "Erro ao realizar cadastro.");
      }
    });
  }
}
