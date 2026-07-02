import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ← ADICIONA

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, RouterLink, CommonModule], // ← ADICIONA CommonModule
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css',
})
export class Cadastrar {
  name = '';
  email = '';
  password = '';
  confirm = '';
  error = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onRegister(event: any) {
    event.preventDefault();

    if (this.password !== this.confirm) {
      alert("As senhas não coincidem!");
      return;
    }

    const user = {
      nome: this.name,
      email: this.email,
      password: this.password
    };

    this.loading = true;
    this.error = ''; // ← Limpa erro anterior

    this.apiService.register(user).subscribe({
      next: (res) => {
        this.loading = false; // ← FALTAVA ISTO
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao realizar cadastro.';
        this.cdr.detectChanges();
      }
    });
  }
}
