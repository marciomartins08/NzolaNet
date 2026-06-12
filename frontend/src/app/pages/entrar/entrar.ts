import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-entrar',
  imports: [FormsModule],
  templateUrl: './entrar.html',
  styleUrl: './entrar.css',
})
export class Entrar {
  private apiService = inject(ApiService);
  private router = inject(Router);

  email = '';
  password = '';

  submeterLogin(event: Event) {
    event.preventDefault();
    this.apiService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        alert(err.error?.message || "Email ou senha incorretos.");
      }
    });
  }
}
