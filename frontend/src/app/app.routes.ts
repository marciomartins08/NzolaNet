import { Routes } from '@angular/router';
import { Cadastrar } from './pages/cadastrar/cadastrar';
import { Home } from './components/home/home';
import { Entrar } from './pages/entrar/entrar';
import { Feed } from './components/feed/feed';
import { Profile } from './pages/perfil/perfil';
import { Usuarios } from './pages/usuarios/usuarios';
import {RecuperarSenha} from './pages/recuperar-senha/recuperar-senha';
import { ResetPassword } from './pages/reset-password/reset-password';

export const routes: Routes = [
    { path: '', component: Home, children:[
        {path: '', redirectTo: 'feed', pathMatch: 'full'},
        {path: 'feed', component: Feed},
        {path: 'perfil', component: Profile},
        {path: 'perfil/:id', component: Profile},
        {path: 'usuarios', component: Usuarios},
    ] },
    { path: 'cadastrar', component: Cadastrar },
    { path: 'login', component: Entrar },
    { path: 'recuperar-senha', component: RecuperarSenha},
    { path: 'reset-password', component: ResetPassword }
];