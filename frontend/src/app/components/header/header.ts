import { Component, Input, Output, EventEmitter, ChangeDetectorRef, input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
export type ViewType = 'feed' | 'profile' | 'notifications' | 'admin';


@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  isAdmin!: boolean
  foco = input.required<string>();


  onLogout(){
    this.apiService.logout().subscribe(
      {
        next: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
          this.cdr.detectChanges();
        }
      }
    )
  }

  hasRoute(route : string){
    return this.router.url == route;
  }
}
