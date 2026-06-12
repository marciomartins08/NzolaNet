import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  email = '';
  token = '';
  password = '';
  confirmPassword = '';
  
  loading = false;
  success = false;
  errorMessage = '';

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.email || !this.token) {
      this.errorMessage = 'Link de redefinição inválido ou incompleto. Solicite um novo link.';
    }
  }

  redefinir(event: Event) {
    event.preventDefault();
    if (!this.email || !this.token) {
      this.errorMessage = 'Token ou e-mail ausentes.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve conter pelo menos 6 caracteres.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.apiService.resetPassword({
      email: this.email,
      token: this.token,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Ocorreu um erro ao redefinir a sua senha. O link pode ter expirado.';
      }
    });
  }
}
