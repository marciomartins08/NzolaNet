import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

type NotificationType = 'publication' | 'like' | 'comment' | 'follow' | 'suggestion';

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  actorName: string;
  actorAvatar: string;
  createdAt: string;
  read: boolean;
  targetUrl?: string;
};

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  loading = signal(false);
  filter = signal<'all' | 'unread'>('all');
  notifications = signal<NotificationItem[]>([]);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);

    this.apiService.getNotifications().subscribe({
      next: (response: any) => {
        const items = Array.isArray(response)
          ? response
          : (response?.notifications || response?.data || []);

        this.notifications.set(items.map((item: any) => this.mapNotification(item)));
        this.loading.set(false);
      },
      error: () => {
        this.notifications.set([]);
        this.loading.set(false);
      }
    });
  }

  get visibleNotifications(): NotificationItem[] {
    const items = this.notifications();
    return this.filter() === 'unread' ? items.filter(item => !item.read) : items;
  }

  get unreadCount(): number {
    return this.notifications().filter(item => !item.read).length;
  }

  setFilter(value: 'all' | 'unread'): void {
    this.filter.set(value);
  }

  markAsRead(notification: NotificationItem): void {
    if (notification.read) {
      this.openTarget(notification);
      return;
    }

    this.notifications.update(items =>
      items.map(item => item.id === notification.id ? { ...item, read: true } : item)
    );

    this.apiService.markNotificationAsRead(notification.id).subscribe({ error: () => undefined });

    this.openTarget(notification);
  }

  markAllAsRead(): void {
    this.notifications.update(items => items.map(item => ({ ...item, read: true })));
    this.apiService.markAllNotificationsAsRead().subscribe({ error: () => undefined });
  }

  deleteNotification(id: number): void {
    this.notifications.update(items => items.filter(item => item.id !== id));
    this.apiService.deleteNotification(id).subscribe({ error: () => undefined });
  }

  iconFor(type: NotificationType): string {
    switch (type) {
      case 'publication': return '✦';
      case 'like': return '♥';
      case 'comment': return '✎';
      case 'follow': return '＋';
      case 'suggestion': return '⇄';
    }
  }

  typeLabel(type: NotificationType): string {
    switch (type) {
      case 'publication': return 'Publicação';
      case 'like': return 'Like';
      case 'comment': return 'Comentário';
      case 'follow': return 'Seguidor';
      case 'suggestion': return 'Sugestão';
    }
  }

  private openTarget(notification: NotificationItem): void {
    if (notification.targetUrl) {
      this.router.navigateByUrl(notification.targetUrl);
    }
  }

  private mapNotification(item: any): NotificationItem {
    return {
      id: item.id,
      type: item.type || 'follow',
      title: item.title || 'Nova notificação',
      message: item.message || item.texto || '',
      actorName: item.actor?.nome || item.actorName || item.user?.nome || 'Utilizador',
      actorAvatar: item.actor?.foto_perfil || item.actorAvatar || item.user?.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      read: Boolean(item.read || item.read_at),
      targetUrl: item.targetUrl || item.url || undefined
    };
  }
}
