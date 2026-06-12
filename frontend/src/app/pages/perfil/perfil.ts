import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Post } from '../../components/post/post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ProfileData = {
  id?: number;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing?: boolean;
  isOwnProfile: boolean;
}

@Component({
  selector: 'app-profile',
  imports: [Post, CommonModule, FormsModule],
  templateUrl: './perfil.html',
})
export class Profile implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  profile = signal<ProfileData>({
    name: '',
    bio: '',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    followers: 0,
    following: 0,
    posts: 0,
    isOwnProfile: true
  });

  userPublications = signal<any[]>([]);
  loading = signal(false);
  editing = signal(false);
  editNome = '';
  editBio = '';

  showAvatarInput = signal(false);
  avatarFile = signal<File | null>(null);
  avatarPreview = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const userId = idParam ? parseInt(idParam, 10) : null;
      this.loadUserAndPublications(userId);
    });
  }

  loadUserAndPublications(userId: number | null) {
    this.loading.set(true);
    
    // Fetch Profile
    const profile$ = userId 
      ? this.apiService.getUser(userId) 
      : this.apiService.getProfile();

    profile$.subscribe({
      next: (user: any) => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isOwn = !userId || userId === currentUser.id;
        
        this.profile.set({
          id: user.id,
          name: user.nome || 'Sem Nome',
          bio: user.bio || 'Sem bio disponível.',
          avatar: user.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          followers: user.followers_count || 0,
          following: user.following_count || 0,
          posts: user.publications_count || 0,
          isFollowing: user.is_following || false,
          isOwnProfile: isOwn
        });

        this.editNome = this.profile().name;
        this.editBio = this.profile().bio;

        // Fetch Publications
        const targetUserId = user.id;
        this.apiService.getUserPublications(targetUserId).subscribe({
          next: (pubs: any) => {
            try {
              const pubsArray = Array.isArray(pubs) ? pubs : (pubs?.publications || pubs?.data || []);
              const mapped = pubsArray
                .map((p: any) => {
                  if (!p) return null;
                  return {
                    id: p.id,
                    userId: p.user_id,
                    text: p.texto,
                    image: p.imagem,
                    video: p.video,
                    userName: user.nome || 'Utilizador',
                    userEmail: user.email || '',
                    userImg: user.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    date: p.created_at ? new Date(p.created_at) : new Date(),
                    likes: 0
                  };
                })
                .filter((p: any) => p !== null);
              
              this.userPublications.set(mapped);
              this.profile.update(p => ({ ...p, posts: mapped.length }));
            } catch (e) {
              console.error('Erro ao processar publicações do perfil:', e);
            } finally {
              this.loading.set(false);
            }
          },
          error: (err) => {
            console.error('Erro ao carregar publicações:', err);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.loading.set(false);
        alert('Erro ao carregar perfil do utilizador.');
      }
    });
  }

  onFollow() {
    const prof = this.profile();
    if (!prof.id) return;
    if (prof.isFollowing) {
      this.apiService.unfollowUser(prof.id).subscribe({
        next: () => {
          this.profile.update(p => ({ ...p, isFollowing: false, followers: p.followers - 1 }));
        },
        error: (err) => alert(err.error?.error || 'Erro ao deixar de seguir.')
      });
    } else {
      this.apiService.followUser(prof.id).subscribe({
        next: () => {
          this.profile.update(p => ({ ...p, isFollowing: true, followers: p.followers + 1 }));
        },
        error: (err) => alert(err.error?.error || 'Erro ao seguir.')
      });
    }
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.avatarFile.set(input.files[0]);
    this.avatarPreview.set(URL.createObjectURL(input.files[0]));
    this.showAvatarInput.set(true);
  }

  saveAvatar() {
    const file = this.avatarFile();
    if (!file) return;

    this.apiService.uploadFile(file).subscribe({
      next: (res: any) => {
        const imageUrl = res.media;
        this.apiService.updateProfile({
          nome: this.profile().name,
          foto_perfil: imageUrl
        }).subscribe({
          next: () => {
            this.profile.update(p => ({ ...p, avatar: imageUrl }));
            // Update localstorage user details too
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentUser.foto_perfil = imageUrl;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            this.showAvatarInput.set(false);
            this.avatarFile.set(null);
            this.avatarPreview.set(null);
            alert('Avatar atualizado com sucesso!');
          },
          error: () => alert('Erro ao atualizar foto de perfil.')
        });
      },
      error: () => alert('Erro ao enviar ficheiro.')
    });
  }

  toggleEdit() {
    this.editing.update(e => !e);
  }

  saveProfile() {
    this.apiService.updateProfile({
      nome: this.editNome,
      bio: this.editBio,
      foto_perfil: this.profile().avatar
    }).subscribe({
      next: (res: any) => {
        this.profile.update(p => ({ ...p, name: this.editNome, bio: this.editBio }));
        this.editing.set(false);

        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.nome = this.editNome;
        localStorage.setItem('user', JSON.stringify(currentUser));

        alert('Perfil atualizado com sucesso!');
      },
      error: () => alert('Erro ao atualizar perfil.')
    });
  }
}