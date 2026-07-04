import { Component, ChangeDetectorRef, input, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
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
    this.loadNotificationCount();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadNotificationCount());
  }

  isAdmin = signal(false);
  unreadNotifications = signal(0);
  foco = input.required<string>();


  verAdmin(){
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if(user?.role === 'admin'){
      this.isAdmin.set(true);
    }
  }

  loadNotificationCount(): void {
    this.apiService.getNotifications().subscribe({
      next: (response: any) => {
        const unreadCount = Number(response?.unread_count ?? 0);
        this.unreadNotifications.set(Number.isNaN(unreadCount) ? 0 : unreadCount);
      },
      error: () => {
        this.unreadNotifications.set(0);
      }
    });
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
