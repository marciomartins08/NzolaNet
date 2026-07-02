import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Feed } from './components/feed/feed';
import { Profile } from './pages/perfil/perfil';
import { Cadastrar } from './pages/cadastrar/cadastrar';
import { Entrar } from './pages/entrar/entrar';
import { RecuperarSenha } from './pages/recuperar-senha/recuperar-senha';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Usuarios } from './pages/usuarios/usuarios';
import { Notifications } from './components/notifications/notifications';
import { Admin } from './components/admin/admin';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminUtilizadores } from './components/admin-utilizadores/admin-utilizadores';
import { AdminPublicacoes } from './components/admin-publicacoes/admin-publicacoes';
import { AdminComentarios } from './components/admin-comentarios/admin-comentarios';

export const routes: Routes = [
    { path: '', component: Home, children:[
        {path: '', redirectTo: 'feed', pathMatch: 'full'},
        {path: 'feed', component: Feed},
        {path: 'perfil', component: Profile},
        {path: 'perfil/:id', component: Profile},
        {path: 'usuarios', component: Usuarios},
        {path: 'notifications', component:Notifications},
        {
          path: 'admin',
          component: Admin,
          children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            { path: 'dashboard', component: AdminDashboard },
            { path: 'utilizadores', component: AdminUtilizadores },
            { path: 'publicacoes', component: AdminPublicacoes },
            { path: 'comentarios', component: AdminComentarios },
          ]
        }

    ] },
    { path: 'cadastrar', component: Cadastrar },
    { path: 'login', component: Entrar },
    { path: 'recuperar-senha', component: RecuperarSenha},
    { path: 'reset-password', component: ResetPassword }
];
