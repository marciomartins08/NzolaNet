import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Route, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin{
  constructor(
    private router: Router,
  ){}

  hasRoute(route: string){
    return this.router.url.includes(route);
  }
}
