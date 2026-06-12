import { Component, input, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private apiService = inject(ApiService);
  private router = inject(Router);

  foco = input.required<string>();

  sair() {
    this.apiService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        // even if api fails, clear and go to login
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
