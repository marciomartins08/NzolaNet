import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Header, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }
}
