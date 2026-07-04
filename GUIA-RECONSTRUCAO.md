# Guia Completo — Reconstruir o NzolaNet Backend (Laravel)

Este documento explica **passo a passo** como recriar o projecto **NzolaNet** do zero, incluindo a arquitectura usada, os comandos Artisan, a autenticação com Sanctum e todas as funcionalidades da API.

---

## Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Visão geral da arquitectura](#2-visão-geral-da-arquitectura)
3. [Criar o projecto Laravel](#3-criar-o-projecto-laravel)
4. [Configurar a base de dados (SQLite)](#4-configurar-a-base-de-dados-sqlite)
5. [Instalar pacotes externos](#5-instalar-pacotes-externos)
6. [Estrutura de pastas a criar](#6-estrutura-de-pastas-a-criar)
7. [Base de dados — Migrations](#7-base-de-dados--migrations)
8. [Models e relações Eloquent](#8-models-e-relações-eloquent)
9. [Autenticação — Login, Registo e Logout (Sanctum)](#9-autenticação--login-registo-e-logout-sanctum)
10. [Perfil de utilizador e Follow/Unfollow](#10-perfil-de-utilizador-e-followunfollow)
11. [Publicações (CRUD)](#11-publicações-crud)
12. [Comentários (CRUD)](#12-comentários-crud)
13. [Upload de ficheiros (imagens/vídeos)](#13-upload-de-ficheiros-imagensvídeos)
14. [Recuperação de senha](#14-recuperação-de-senha)
15. [Rotas da API](#15-rotas-da-api)
16. [CORS (frontend Angular)](#16-cors-frontend-angular)
17. [Swagger / Documentação da API](#17-swagger--documentação-da-api)
18. [Seeders (dados de teste)](#18-seeders-dados-de-teste)
19. [Executar o projecto](#19-executar-o-projecto)
20. [Testar a API (exemplos)](#20-testar-a-api-exemplos)
21. [Resumo de todos os comandos](#21-resumo-de-todos-os-comandos)

---

## 1. Pré-requisitos

Antes de começar, instala:

| Ferramenta | Versão mínima |
|---|---|
| PHP | 8.3+ |
| Composer | 2.x |
| Extensões PHP | `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo` |
| Node.js (opcional) | 18+ (para assets Vite) |

Verifica a instalação:

```bash
php -v
composer -V
```

---

## 2. Visão geral da arquitectura

O NzolaNet usa uma arquitectura em **camadas** para separar responsabilidades:

```
Cliente (Angular / Postman)
        │
        ▼
   routes/api.php          ← Define os endpoints
        │
        ▼
   Controller               ← Recebe HTTP, devolve JSON
        │
        ├── FormRequest     ← Valida os dados de entrada (login, registo, upload)
        ├── DTO             ← Transporta dados validados entre camadas
        ▼
   Service                  ← Lógica de negócio (regras, permissões)
        │
        ▼
   Repository               ← Acesso à base de dados (queries Eloquent)
        │
        ▼
   Model (Eloquent)         ← Representa uma tabela
        │
        ▼
   Base de dados (SQLite)
```

### Fluxo de uma requisição (exemplo: Login)

```
POST /api/login
  → LoginRequest valida email e password
  → LoginDTO::fromRequest() cria o objeto de dados
  → AuthController chama AuthService->login()
  → AuthService usa UserRepository->findByEmail()
  → Hash::check() verifica a password
  → Sanctum cria um token: $user->createToken('auth_token')
  → Controller devolve JSON com user + token
```

### Porquê esta arquitectura?

| Camada | Responsabilidade |
|---|---|
| **Controller** | Só lida com HTTP (request/response) |
| **FormRequest** | Validação de entrada |
| **DTO** | Objeto imutável com dados limpos |
| **Service** | Regras de negócio (ex: "não podes seguir-te a ti próprio") |
| **Repository** | Queries à BD (facilita testes e manutenção) |
| **Model** | Relações Eloquent e `$fillable` |

---

## 3. Criar o projecto Laravel

```bash
# Cria um novo projecto Laravel 13
composer create-project laravel/laravel nzolanet-back

cd nzolanet-back

# Gera a chave da aplicação
php artisan key:generate
```

> O Laravel 13 já vem com a estrutura moderna (`bootstrap/app.php` em vez de `Kernel.php`).

---

## 4. Configurar a base de dados (SQLite)

O projecto usa **SQLite** (ficheiro local, sem instalar MySQL).

### 4.1 Criar o ficheiro da base de dados

```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File

# Linux / macOS
touch database/database.sqlite
```

### 4.2 Configurar o `.env`

Abre o ficheiro `.env` e confirma estas linhas:

```env
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

> Com SQLite, as linhas `DB_HOST`, `DB_PORT`, etc. ficam comentadas.

---

## 5. Instalar pacotes externos

### 5.1 Laravel Sanctum (autenticação por token)

```bash
composer require laravel/sanctum

# Publica a migration dos tokens
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5.2 L5-Swagger (documentação da API)

```bash
composer require darkaonline/l5-swagger

# Publica a configuração
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

### 5.3 IDE Helper (opcional, só desenvolvimento)

```bash
composer require --dev barryvdh/laravel-ide-helper
```

---

## 6. Estrutura de pastas a criar

Cria manualmente estas pastas dentro de `app/`:

```bash
mkdir app/DTOs
mkdir app/Services
mkdir app/Repositories
```

Estrutura final de `app/`:

```
app/
├── DTOs/
│   ├── CommentDTO.php
│   ├── LoginDTO.php
│   ├── PublicationDTO.php
│   ├── RegisterDTO.php
│   └── UpdateProfileDTO.php
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── CommentController.php
│   │   ├── Controller.php
│   │   ├── PasswordResetController.php
│   │   ├── PublicationController.php
│   │   ├── UploadController.php
│   │   └── UserController.php
│   └── Requests/
│       ├── LoginRequest.php
│       ├── RegisterRequest.php
│       └── UploadRequest.php
├── Models/
│   ├── Comment.php
│   ├── Publication.php
│   └── User.php
├── Repositories/
│   ├── CommentRepository.php
│   ├── PublicationRepository.php
│   └── UserRepository.php
└── Services/
    ├── AuthService.php
    ├── CommentService.php
    ├── PublicationService.php
    └── UserService.php
```

---

## 7. Base de dados — Migrations

### 7.1 Migration de utilizadores (modificar a default)

O Laravel cria automaticamente `0001_01_01_000000_create_users_table.php`. **Edita** esse ficheiro:

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('nome');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('foto_perfil')->nullable();
    $table->enum('privacidade', ['publico', 'privado'])->default('publico');
    $table->timestamps();
});
```

> Nota: usamos `nome` em vez de `name` (padrão Laravel).

### 7.2 Criar migration de publicações

```bash
php artisan make:migration create_publications_table
```

Conteúdo:

```php
Schema::create('publications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->text('texto');
    $table->string('imagem')->nullable();
    $table->string('video')->nullable();
    $table->timestamps();
});
```

### 7.3 Criar migration de comentários

```bash
php artisan make:migration create_comments_table
```

Conteúdo:

```php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('publication_id')->constrained('publications')->onDelete('cascade');
    $table->text('texto');
    $table->timestamps();
});
```

### 7.4 Criar migration de followers (seguir utilizadores)

```bash
php artisan make:migration create_followers_table
```

Conteúdo:

```php
Schema::create('followers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('follower_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->timestamps();

    $table->unique(['follower_id', 'user_id']);
});
```

> `follower_id` = quem segue | `user_id` = quem é seguido

### 7.5 Executar todas as migrations

```bash
php artisan migrate
```

Isto cria as tabelas:
- `users`
- `password_reset_tokens`
- `sessions`
- `cache`, `jobs` (default Laravel)
- `personal_access_tokens` (Sanctum)
- `publications`
- `comments`
- `followers`

---

## 8. Models e relações Eloquent

### 8.1 User Model

```bash
# O model User já existe por defeito — edita-o
```

Pontos importantes no `app/Models/User.php`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['nome', 'email', 'password', 'foto_perfil', 'privacidade'];
    protected $hidden = ['password'];

    // Relações:
    public function publications()  { return $this->hasMany(Publication::class); }
    public function comments()      { return $this->hasMany(Comment::class); }
    public function followers()     { return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id')->withTimestamps(); }
    public function following()     { return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id')->withTimestamps(); }
}
```

### 8.2 Publication Model

```bash
php artisan make:model Publication
```

```php
protected $fillable = ['user_id', 'texto', 'imagem', 'video'];

public function user()     { return $this->belongsTo(User::class); }
public function comments() { return $this->hasMany(Comment::class); }
```

### 8.3 Comment Model

```bash
php artisan make:model Comment
```

```php
protected $fillable = ['user_id', 'publication_id', 'texto'];

public function user()        { return $this->belongsTo(User::class); }
public function publication() { return $this->belongsTo(Publication::class); }
```

---

## 9. Autenticação — Login, Registo e Logout (Sanctum)

Esta é a parte **principal** do projecto. Segue a ordem abaixo.

### Passo 1 — FormRequests (validação)

```bash
php artisan make:request RegisterRequest
php artisan make:request LoginRequest
```

**RegisterRequest** — regras:
```php
'nome'     => 'required|string|max:255',
'email'    => 'required|string|email|max:255|unique:users',
'password' => 'required|string|min:6',
'privacidade' => 'nullable|string|in:publico,privado',
```

**LoginRequest** — regras:
```php
'email'    => 'required|string|email',
'password' => 'required|string',
```

### Passo 2 — DTOs (transporte de dados)

Cria manualmente em `app/DTOs/`:

**RegisterDTO.php:**
```php
class RegisterDTO
{
    public function __construct(
        public readonly string $nome,
        public readonly string $email,
        public readonly string $password
    ) {}

    public static function fromRequest(RegisterRequest $request): self
    {
        return new self(
            nome: $request->validated('nome'),
            email: $request->validated('email'),
            password: $request->validated('password')
        );
    }
}
```

**LoginDTO.php** — mesma ideia com `email` e `password`.

### Passo 3 — Repository

Cria `app/Repositories/UserRepository.php`:

```php
class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
```

### Passo 4 — Service (lógica de negócio)

Cria `app/Services/AuthService.php`:

```php
class AuthService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function register(RegisterDTO $dto): array
    {
        $user = $this->userRepository->create([
            'nome'     => $dto->nome,
            'email'    => $dto->email,
            'password' => Hash::make($dto->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais introduzidas estão incorretas.'],
            ]);
        }

        // Apaga tokens antigos (só 1 sessão activa)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
```

### Passo 5 — Controller

```bash
php artisan make:controller AuthController
```

```php
class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $dto = RegisterDTO::fromRequest($request);
        $result = $this->authService->register($dto);

        return response()->json([
            'message' => 'Utilizador registado com sucesso!',
            'user'    => $result['user'],
            'token'   => $result['token']
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $dto = LoginDTO::fromRequest($request);
        $result = $this->authService->login($dto);

        return response()->json([
            'message' => 'Login efetuado com sucesso!',
            'user'    => $result['user'],
            'token'   => $result['token']
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessão terminada com sucesso!'
        ], 200);
    }
}
```

### Passo 6 — Como funciona o Sanctum

1. **Registo/Login** → Laravel cria um token na tabela `personal_access_tokens`
2. O token é devolvido ao cliente (Angular/Postman)
3. O cliente envia o token em cada pedido protegido:

```
Authorization: Bearer 1|abc123def456...
```

4. O middleware `auth:sanctum` nas rotas verifica o token automaticamente
5. **Logout** → apaga o token actual da BD

### Injeção de dependências (automática)

O Laravel resolve automaticamente:
```
AuthController → AuthService → UserRepository
```
Não precisas registar nada no `AppServiceProvider` — o container do Laravel faz isto sozinho quando usas `__construct()`.

---

## 10. Perfil de utilizador e Follow/Unfollow

### Comandos para criar ficheiros

```bash
php artisan make:controller UserController
```

Cria manualmente:
- `app/DTOs/UpdateProfileDTO.php`
- `app/Services/UserService.php`
- Adiciona métodos `update()`, `follow()`, `unfollow()` ao `UserRepository`

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/profile` | Ver perfil (com contadores) |
| PUT | `/api/profile` | Actualizar nome, foto, privacidade |
| POST | `/api/users/{id}/follow` | Seguir utilizador |
| DELETE | `/api/users/{id}/unfollow` | Deixar de seguir |

### Regra de negócio (UserService)

```php
public function followUser(User $user, int $targetUserId): void
{
    if ($user->id === $targetUserId) {
        throw new Exception("Não podes seguir-te a ti próprio.");
    }
    $this->userRepository->follow($user, $targetUserId);
}
```

---

## 11. Publicações (CRUD)

### Comandos

```bash
php artisan make:controller PublicationController
php artisan make:model Publication -m   # se ainda não criaste
```

Cria manualmente:
- `app/DTOs/PublicationDTO.php`
- `app/Services/PublicationService.php`
- `app/Repositories/PublicationRepository.php`

### Endpoints

| Método | Rota | Auth? | Descrição |
|---|---|---|---|
| GET | `/api/publications` | Não | Listar todas (público) |
| POST | `/api/publications` | Sim | Criar publicação |
| PUT | `/api/publications/{id}` | Sim | Editar (só o dono) |
| DELETE | `/api/publications/{id}` | Sim | Apagar (só o dono) |

### Campos de uma publicação

```json
{
    "texto": "Olá NzolaNet!",
    "imagem": "http://localhost:8000/storage/uploads/foto.jpg",
    "video": null
}
```

---

## 12. Comentários (CRUD)

### Comandos

```bash
php artisan make:controller CommentController
php artisan make:model Comment -m
```

Cria manualmente:
- `app/DTOs/CommentDTO.php`
- `app/Services/CommentService.php`
- `app/Repositories/CommentRepository.php`

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/publications/{id}/comments` | Listar comentários |
| POST | `/api/publications/{id}/comments` | Criar comentário |
| PUT | `/api/comments/{id}` | Editar (só o autor) |
| DELETE | `/api/comments/{id}` | Apagar (só o autor) |

---

## 13. Upload de ficheiros (imagens/vídeos)

### Comandos

```bash
php artisan make:controller UploadController
php artisan make:request UploadRequest

# Criar link simbólico para storage público
php artisan storage:link
```

### UploadRequest — validação

```php
'media' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi,webm|max:20480'
```

> `max:20480` = máximo 20 MB

### UploadController

```php
public function upload(UploadRequest $request): JsonResponse
{
    $path = $request->file('media')->store('uploads', 'public');

    return response()->json([
        'message' => 'Ficheiro armazenado com sucesso',
        'media'   => asset('storage/' . $path)
    ], 200);
}
```

O ficheiro fica em `storage/app/public/uploads/` e é acessível via `http://localhost:8000/storage/uploads/nome.jpg`.

---

## 14. Recuperação de senha

```bash
php artisan make:controller PasswordResetController
```

### Fluxo

1. **POST `/api/forgot-password`** — recebe email, gera token, guarda em `password_reset_tokens`, envia email
2. **POST `/api/reset-password`** — recebe email + token + nova password, valida e actualiza

> A tabela `password_reset_tokens` já vem na migration default de users.

### Configurar email no `.env` (desenvolvimento)

```env
MAIL_MAILER=log
```

Com `MAIL_MAILER=log`, os emails aparecem em `storage/logs/laravel.log` em vez de serem enviados.

---

## 15. Rotas da API

Edita `routes/api.php`:

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UploadController;

// Rotas públicas (sem token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/publications', [PublicationController::class, 'index']);

// Rotas protegidas (precisam de token Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::post('/users/{id}/follow', [UserController::class, 'follow']);
    Route::delete('/users/{id}/unfollow', [UserController::class, 'unfollow']);

    Route::post('/publications', [PublicationController::class, 'store']);
    Route::put('/publications/{id}', [PublicationController::class, 'update']);
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);

    Route::get('/publications/{publicationId}/comments', [CommentController::class, 'index']);
    Route::post('/publications/{publicationId}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::post('/upload', [UploadController::class, 'upload']);

    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});
```

> Todas as rotas em `api.php` têm prefixo `/api` automaticamente (ex: `/api/login`).

---

## 16. CORS (frontend Angular)

O frontend Angular corre em `http://localhost:4200`. Edita `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:4200'],
'allowed_headers' => ['*'],
'supports_credentials' => false,
```

---

## 17. Swagger / Documentação da API

### Configurar anotações no Controller base

Edita `app/Http/Controllers/Controller.php`:

```php
use OpenApi\Attributes as OA;

#[OA\Info(
    title: "NzolaNet API",
    version: "1.0.0",
    description: "Backend do Projecto Final de AW"
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Servidor Local de Desenvolvimento"
)]
abstract class Controller { }
```

### Gerar documentação

```bash
php artisan l5-swagger:generate
```

Acede à documentação interactiva em:

```
http://localhost:8000/api/documentation
```

---

## 18. Seeders (dados de teste)

```bash
php artisan make:seeder DatabaseSeeder   # já existe por defeito
```

Edita `database/seeders/DatabaseSeeder.php` com utilizadores de teste e executa:

```bash
php artisan db:seed
```

Utilizadores criados:

| Nome | Email | Password |
|---|---|---|
| Marcio Martins | marcio@nzolanet.com | 123456 |
| Ivanilson Jerónimo | ivanilson@nzolanet.com | 123456 |
| Elisa | elisa@nzolanet.com | 123456 |

---

## 19. Executar o projecto

```bash
# Iniciar servidor de desenvolvimento
php artisan serve

# A API fica disponível em:
# http://localhost:8000/api
```

Para correr tudo de uma vez (servidor + queue + logs + vite):

```bash
composer dev
```

---

## 20. Testar a API (exemplos)

### Registo

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste User\",\"email\":\"teste@email.com\",\"password\":\"123456\"}"
```

Resposta:
```json
{
    "message": "Utilizador registado com sucesso!",
    "user": { "id": 1, "nome": "Teste User", "email": "teste@email.com" },
    "token": "1|abc123..."
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"marcio@nzolanet.com\",\"password\":\"123456\"}"
```

### Ver perfil (com token)

```bash
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar publicação

```bash
curl -X POST http://localhost:8000/api/publications \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"texto\":\"A minha primeira publicação!\"}"
```

### Upload de ficheiro

```bash
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "media=@/caminho/para/foto.jpg"
```

### Logout

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 21. Resumo de todos os comandos

### Setup inicial

```bash
composer create-project laravel/laravel nzolanet-back
cd nzolanet-back
php artisan key:generate
New-Item -Path database/database.sqlite -ItemType File   # Windows
composer require laravel/sanctum
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

### Migrations

```bash
php artisan make:migration create_publications_table
php artisan make:migration create_comments_table
php artisan make:migration create_followers_table
php artisan migrate
```

### Models

```bash
php artisan make:model Publication
php artisan make:model Comment
```

### Controllers

```bash
php artisan make:controller AuthController
php artisan make:controller UserController
php artisan make:controller PublicationController
php artisan make:controller CommentController
php artisan make:controller UploadController
php artisan make:controller PasswordResetController
```

### Form Requests

```bash
php artisan make:request RegisterRequest
php artisan make:request LoginRequest
php artisan make:request UploadRequest
```

### Storage e Seeders

```bash
php artisan storage:link
php artisan db:seed
```

### Swagger

```bash
php artisan l5-swagger:generate
```

### Executar

```bash
php artisan serve
# ou
composer dev
```

---

## Ordem recomendada para reconstruir

Segue esta sequência — cada passo depende do anterior:

```
1.  Criar projecto Laravel + configurar SQLite
2.  Instalar Sanctum + L5-Swagger
3.  Criar pastas (DTOs, Services, Repositories)
4.  Migrations → php artisan migrate
5.  Models com relações Eloquent
6.  ★ AUTENTICAÇÃO (RegisterRequest → LoginRequest → DTOs → UserRepository → AuthService → AuthController)
7.  Definir rotas em api.php
8.  User (perfil + follow)
9.  Publications (CRUD)
10. Comments (CRUD)
11. Upload de ficheiros + storage:link
12. Recuperação de senha
13. CORS
14. Swagger
15. Seeders
16. Testar com curl/Postman
```

---

## Diagrama de relações da base de dados

```
┌─────────────┐       ┌────────────────┐       ┌─────────────┐
│    users    │──1:N──│  publications  │──1:N──│  comments   │
│             │       │                │       │             │
│ id          │       │ id             │       │ id          │
│ nome        │       │ user_id (FK)   │       │ user_id(FK) │
│ email       │       │ texto          │       │ pub_id (FK) │
│ password    │       │ imagem         │       │ texto       │
│ foto_perfil │       │ video          │       └─────────────┘
│ privacidade │       └────────────────┘
└─────────────┘
       │
       │  N:N (tabela followers)
       │
       ▼
┌─────────────┐
│  followers  │
│             │
│ follower_id │──→ quem segue
│ user_id     │──→ quem é seguido
└─────────────┘

┌─────────────────────────┐
│ personal_access_tokens  │  ← Sanctum (tokens de login)
│ tokenable_id → users.id │
└─────────────────────────┘
```

---

*Boa sorte a reconstruir o projecto! Se tiveres dúvidas sobre algum passo, consulta a [documentação oficial do Laravel](https://laravel.com/docs) ou o código actual em cada ficheiro do projecto.*
