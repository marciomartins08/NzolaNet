import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  // Auth
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  // Profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }

  // Users Search & Profiles
  searchUsers(search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, { params: { search } });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  followUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${id}/follow`, {});
  }

  unfollowUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}/unfollow`);
  }

  // Publications
  getPublications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/publications`);
  }

  getUserPublications(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/publications`);
  }

  createPublication(data: { texto: string; imagem?: string; video?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications`, data);
  }

  updatePublication(id: number, data: { texto: string; imagem?: string; video?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/publications/${id}`, data);
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/publications/${id}`);
  }

  // Comments
  getComments(publicationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/publications/${publicationId}/comments`);
  }

  addComment(publicationId: number, text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications/${publicationId}/comments`, { texto: text });
  }

  updateComment(id: number, text: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/comments/${id}`, { texto: text });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${id}`);
  }

  // File Upload
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('media', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}
