import { Component, OnInit, inject, signal } from '@angular/core';
import { Createpost } from '../createpost/createpost';
import { Post } from '../post/post';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-feed',
  imports: [Createpost, Post, CommonModule],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  private apiService = inject(ApiService);

  publications = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.carregarPublicacoes();
  }

  carregarPublicacoes() {
    this.loading.set(true);
    this.apiService.getPublications().subscribe({
      next: (data) => {
        try {
          const pubsArray = Array.isArray(data) ? data : (data?.publications || data?.data || []);
          const mapped = pubsArray
            .map((pub: any) => this.mapApiPublicationToPost(pub))
            .filter((pub: any) => pub !== null);
          this.publications.set(mapped);
        } catch (e) {
          console.error('Erro ao processar dados de publicações:', e);
        } finally {
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar publicações:', err);
        this.loading.set(false);
      }
    });
  }

  mapApiPublicationToPost(pub: any) {
    if (!pub) return null;
    return {
      id: pub.id,
      userId: pub.user_id,
      text: pub.texto,
      image: pub.imagem,
      video: pub.video,
      userName: pub.user?.nome || 'Utilizador',
      userEmail: pub.user?.email || '',
      userImg: pub.user?.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      date: pub.created_at ? new Date(pub.created_at) : new Date(),
      bazes: pub.bazes_count,
      comments: pub.comments_count,
      likedByMe: pub.likedByMe
    };
  }

  handleCreate(postData: any) {
    const text = postData.text;
    const fileImage = postData.fileImage;
    const fileVideo = postData.fileVideo;

    if (!text && !fileImage && !fileVideo) {
      alert("A publicação não pode estar vazia!");
      return;
    }

    const imageUpload$ = fileImage ? this.apiService.uploadFile(fileImage) : of(null);
    const videoUpload$ = fileVideo ? this.apiService.uploadFile(fileVideo) : of(null);

    this.loading.set(true);
    forkJoin({
      imgRes: imageUpload$,
      vidRes: videoUpload$
    }).subscribe({
      next: (uploads: any) => {
        const imageUrl = uploads.imgRes ? uploads.imgRes.media : undefined;
        const videoUrl = uploads.vidRes ? uploads.vidRes.media : undefined;

        this.apiService.createPublication({
          texto: text,
          imagem: imageUrl,
          video: videoUrl
        }).subscribe({
          next: () => {
            this.carregarPublicacoes();
          },
          error: (err) => {
            alert(err.error?.message || "Erro ao criar publicação.");
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        alert("Erro ao enviar ficheiros de média.");
        this.loading.set(false);
      }
    });
  }

  atualizarLike(event: { postId: number; liked: boolean }) {
    this.publications.update(posts =>
      posts.map(post =>
        post.id === event.postId
          ? {
              ...post,
              likedByMe: event.liked,
              bazes: event.liked ? post.bazes + 1 : post.bazes - 1
            }
          : post
      )
    );
  }
}
