import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  isLogin = true;
  authData = { username: '', email: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    const endpoint = this.isLogin ? '/api/users/login' : '/api/users/register';

    this.http.post<any>(`http://localhost:8080${endpoint}`, this.authData).subscribe({
      next: (user) => {
        // Store user in LocalStorage so the app remembers who you are
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(this.isLogin ? 'Welcome back!' : 'Account created!');
        this.router.navigate(['/library']); // Redirect to the music part
      },
      error: (err) => alert('Auth Failed: ' + (err.error?.message || 'Check connection'))
    });
  }
}
