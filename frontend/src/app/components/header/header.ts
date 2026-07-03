import { Component, Input, Output, EventEmitter, ChangeDetectorRef, input, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
export type ViewType = 'feed' | 'profile' | 'notifications' | 'admin';


@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.verAdmin();
  }

  isAdmin = signal(false);
  foco = input.required<string>();


  verAdmin(){
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if(user?.role === 'admin'){
      this.isAdmin.set(true);
    }
  }



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
