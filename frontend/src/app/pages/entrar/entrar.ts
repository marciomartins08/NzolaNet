import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-entrar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './entrar.html',
  styleUrl: './entrar.css',
})

export class Entrar {

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = ''

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onLogin(event: any) {
    event.preventDefault();
    const user = { email: this.email, password: this.password };
    this.loading = true;
    this.apiService.login(user).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.loading = false;
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.error = "Email ou senha incorretos";
      }
    });
  }
}
