# Descrição das Classes — Backend (Laravel)

## Estrutura em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                          │
│  AuthController, UserController, PublicationController, │
│  CommentController, BazeController, UploadController,   │
│  PasswordResetController                                │
├─────────────────────────────────────────────────────────┤
│                     Services                            │
│  AuthService, UserService, PublicationService,          │
│  CommentService, BazeService                            │
├─────────────────────────────────────────────────────────┤
│                   Repositories                          │
│  UserRepository, PublicationRepository,                 │
│  CommentRepository, BazeRepository                      │
├─────────────────────────────────────────────────────────┤
│                      DTOs                               │
│  LoginDTO, RegisterDTO, PublicationDTO,                 │
│  CommentDTO, UpdateProfileDTO                           │
├─────────────────────────────────────────────────────────┤
│                     Requests                            │
│  LoginRequest, RegisterRequest, UploadRequest           │
├─────────────────────────────────────────────────────────┤
│                      Models                             │
│  User, Publication, Comment, Baze                       │
└─────────────────────────────────────────────────────────┘
```

Todas as classes seguem o padrão **Repository Pattern + Service Layer**:

- **Controller** recebe o pedido HTTP e delega ao **Service**
- **Service** contém a lógica de negócio e usa o **Repository**
- **Repository** faz as queries ao banco (Eloquent ORM)
- **DTO** transporta dados validados entre camadas
- **Request** (FormRequest) valida os dados de entrada
- **Model** representa a tabela no banco

---

## 1. Models (Entidades do Domínio)

### Padrão Repetitivo em TODOS os Models

| Atributo/Método Comum | Descrição |
|---|---|
| `use HasFactory;` | Trait do Eloquent para factories |
| `protected $fillable = [...]` | Atributos que podem ser preenchidos em massa |
| Timestamps (`created_at`, `updated_at`) | Geridos automaticamente pelo Eloquent |
| Relacionamentos (`belongsTo`, `hasMany`) | Definem as associações entre entidades |

### User
**Tabela:** `users`

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | int (PK) | Identificador único |
| `nome` | string | Nome do utilizador |
| `email` | string | Email único |
| `password` | string (hidden) | Password com hash |
| `foto_perfil` | string|null | URL/Path da foto |
| `privacidade` | string|null | publico / privado |
| `role` | string|null | user / admin |

| Método | Tipo Retorno | Descrição |
|---|---|---|
| `publications()` | HasMany | Publicações do user |
| `comments()` | HasMany | Comentários do user |
| `followers()` | BelongsToMany | Seguidores (tabela pivot `followers`) |
| `following()` | BelongsToMany | A seguir (tabela pivot `followers`) |
| `bazes()` | HasMany | "Likes"/Bazes do user |

**Traits:** `HasApiTokens` (Sanctum), `HasFactory`, `Notifiable`
**Herança:** `extends Authenticatable`

---

### Publication
**Tabela:** `publications`

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | int (PK) | Identificador único |
| `user_id` | int (FK) | Referência ao User |
| `texto` | text | Conteúdo da publicação |
| `imagem` | string|null | URL/Path da imagem |
| `video` | string|null | URL/Path do vídeo |

| Método | Tipo Retorno | Descrição |
|---|---|---|
| `user()` | BelongsTo | User que criou |
| `comments()` | HasMany | Comentários da publicação |
| `bazes()` | HasMany | Bazes da publicação |

---

### Comment
**Tabela:** `comments`

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | int (PK) | Identificador único |
| `user_id` | int (FK) | Referência ao User |
| `publication_id` | int (FK) | Referência à Publication |
| `texto` | text | Conteúdo do comentário |

| Método | Tipo Retorno | Descrição |
|---|---|---|
| `user()` | BelongsTo | User que comentou |
| `publication()` | BelongsTo | Publication comentada |

---

### Baze
**Tabela:** `bazes`

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | int (PK) | Identificador único |
| `user_id` | int (FK) | Referência ao User |
| `publication_id` | int (FK) | Referência à Publication |

| Método | Tipo Retorno | Descrição |
|---|---|---|
| `user()` | BelongsTo | User que deu o like |
| `publication()` | BelongsTo | Publication que recebeu like |

---

## 2. DTOs (Data Transfer Objects)

### Padrão Repetitivo em TODOS os DTOs

| Método Comum | Descrição |
|---|---|
| `fromRequest(Request $request): self` | Factory estática que extrai dados validados do request |
| `public readonly` | Todos os atributos são `public readonly` (PHP 8.1+) |

### LoginDTO
| Atributo | Tipo |
|---|---|
| `email` | string |
| `password` | string |

### RegisterDTO
| Atributo | Tipo |
|---|---|
| `nome` | string |
| `email` | string |
| `password` | string |

### PublicationDTO
| Atributo | Tipo |
|---|---|
| `texto` | ?string |
| `imagem` | ?string |
| `video` | ?string |

### CommentDTO
| Atributo | Tipo |
|---|---|
| `texto` | ?string |

### UpdateProfileDTO
| Atributo | Tipo |
|---|---|
| `nome` | ?string |
| `foto_perfil` | ?string |
| `privacidade` | ?string |

---

## 3. Requests (Validação)

### Padrão Repetitivo em TODOS os Requests

| Método Comum | Descrição |
|---|---|
| `authorize(): bool` | Retorna `true` (autorizado) |
| `rules(): array` | Regras de validação para os campos |

### LoginRequest
| Campo | Regras |
|---|---|
| `email` | required, string, email |
| `password` | required, string |

### RegisterRequest
| Campo | Regras |
|---|---|
| `nome` | required, string, max:255 |
| `email` | required, string, email, max:255, unique:users |
| `password` | required, string, min:6 |
| `privacidade` | nullable, string, in:publico,privado |

### UploadRequest
| Campo | Regras |
|---|---|
| `media` | required, file, mimes:jpeg,png,jpg,gif,mp4,mov,avi,webm, max:20480 |

---

## 4. Controllers

### Padrão Repetitivo em TODOS os Controllers

| Característica | Descrição |
|---|---|
| `extends Controller` | Todos estendem o `Controller` abstrato |
| Injecção do Service | Atributo `protected` recebido no construtor |
| Retorno `JsonResponse` | Todos os métodos retornam `JsonResponse` |
| `$request` como parâmetro | O request HTTP é sempre passado como primeiro argumento |

### Controller (abstrato base)
- Namespace: `App\Http\Controllers`
- Métodos: `testeSwagger()` → `response()->json(['status' => 'ok'])`
- Anotação OpenAPI para documentação

### AuthController
| Método | Rota | Descrição |
|---|---|---|
| `register(RegisterRequest)` | POST /register | Regista novo user |
| `login(LoginRequest)` | POST /login | Autentica user |
| `logout(Request)` | POST /logout | Termina sessão |

**Atributo:** `protected AuthService $authService`

### UserController
| Método | Rota | Descrição |
|---|---|---|
| `index(Request)` | GET /users?search= | Pesquisar users |
| `show(Request)` | GET /profile | Perfil do auth user |
| `showUser(Request, $id)` | GET /users/{id} | Perfil de user específico |
| `update(Request)` | PUT /profile | Atualizar perfil |
| `destroy(Request, User)` | DELETE /users/{id} | Remover user (admin) |
| `contar()` | GET /users/count | Contar users |
| `most()` | GET /users/most | User com mais publicações |
| `mostrar()` | GET /users/show | Listar todos users |
| `follow(Request, $id)` | POST /users/{id}/follow | Seguir user |
| `unfollow(Request, $id)` | DELETE /users/{id}/unfollow | Deixar de seguir |
| `promote(Request, $id)` | POST /users/{id}/promote | Promover a admin |

**Atributo:** `protected UserService $userService`

### PublicationController
| Método | Rota | Descrição |
|---|---|---|
| `index(Request)` | GET /publications | Listar publicações |
| `userPublications(Request, $id)` | GET /users/{id}/publications | Publicações de um user |
| `store(Request)` | POST /publications | Criar publicação |
| `update(Request, $id)` | PUT /publications/{id} | Editar publicação |
| `destroy(Request, $id)` | DELETE /publications/{id} | Apagar (própria) |
| `deletar(Request, $id)` | DELETE /publicationsany/{id} | Apagar qualquer (admin) |
| `contar()` | GET /publications/count | Contar publicações |

**Atributo:** `protected PublicationService $publicationService`

### CommentController
| Método | Rota | Descrição |
|---|---|---|
| `index($publicationId)` | GET /publications/{pid}/comments | Comentários de uma pub |
| `listar()` | GET /comments | Listar todos comentários |
| `getComment(Request, $id)` | GET /comments/{id} | Comentário específico |
| `store(Request, $publicationId)` | POST /publications/{pid}/comments | Criar comentário |
| `update(Request, $id)` | PUT /comments/{id} | Editar comentário |
| `destroy(Request, $id)` | DELETE /comments/{id} | Apagar (próprio) |
| `deletar(Request, $id)` | DELETE /comments/admin/{id} | Apagar qualquer (admin) |
| `contar()` | GET /comments/count | Contar comentários |

**Atributo:** `protected CommentService $commentService`

### BazeController
| Método | Rota | Descrição |
|---|---|---|
| `index()` | GET /bazes | Listar todos bazes |
| `store(Request, $id)` | POST /publications/{id}/like | Dar like |
| `destroy(Request, $id)` | DELETE /publications/{id}/remove | Remover like |
| `create()` | — | Vazio (não usado) |
| `show(Baze)` | — | Vazio (não usado) |
| `edit(Baze)` | — | Vazio (não usado) |
| `update(Request, Baze)` | — | Vazio (não usado) |

**Atributo:** `protected BazeService $bazeService`

### PasswordResetController
| Método | Rota | Descrição |
|---|---|---|
| `sendResetLink(Request)` | POST /forgot-password | Enviar link de reset |
| `resetPassword(Request)` | POST /reset-password | Redefinir password |

### UploadController
| Método | Rota | Descrição |
|---|---|---|
| `upload(UploadRequest)` | POST /upload | Upload de ficheiro (imagem/vídeo) |

---

## 5. Services (Lógica de Negócio)

### Padrão Repetitivo em TODOS os Services

| Característica | Descrição |
|---|---|
| Injecção do Repository | Atributo `protected` recebido no construtor |
| Métodos CRUD | Operações básicas delegadas ao Repository |
| Lógica de autorização | Verifica se o user pode executar a ação (ex: dono do recurso) |

### AuthService
**Atributo:** `UserRepository $userRepository`
| Método | Descrição |
|---|---|
| `register(RegisterDTO): array` | Cria user + gera token Sanctum |
| `login(LoginDTO): array` | Autentica + gera token |

### UserService
**Atributo:** `UserRepository $userRepository`
| Método | Descrição |
|---|---|
| `getUsersWithPublications(): Collection` | Users ordenados por nº publicações |
| `deleteUser(int): void` | Apagar user (admin) |
| `getUsers(): Collection` | Listar todos users |
| `searchUsers(string): Collection` | Pesquisar users por nome |
| `getUserProfile(int): User` | Perfil com seguidores/seguindo |
| `countUsers(): int` | Total users |
| `updateProfile(User, UpdateProfileDTO): User` | Atualizar dados do perfil |
| `followUser(User, int): void` | Seguir user |
| `unfollowUser(User, int): void` | Deixar de seguir |
| `promoteService(int): void` | Tornar admin |
| `destroyService(User): void` | Apagar própria conta |

### PublicationService
**Atributo:** `PublicationRepository $publicationRepository`
| Método | Descrição |
|---|---|
| `getAllPublications(User): Collection` | Publicações (com info de like) |
| `getUserPublications(int): Collection` | Publicações de user específico |
| `countPublications(): int` | Total publicações |
| `createPublication(User, PublicationDTO): Publication` | Criar |
| `updatePublication(int, User, PublicationDTO): Publication` | Editar (só dono) |
| `deletePublication(int, User): void` | Apagar (só dono) |
| `deletePublicationAny(int): void` | Apagar qualquer (admin) |

### CommentService
**Atributos:** `CommentRepository $commentRepository`, `PublicationRepository $publicationRepository`
| Método | Descrição |
|---|---|
| `getCommentsByPublication(int): Collection` | Comentários de uma publicação |
| `getCommentById(int, User): Comment` | Comentário específico |
| `getAllComments(): Collection` | Todos comentários |
| `getCount(): int` | Total comentários |
| `createComment(User, int, CommentDTO): Comment` | Criar |
| `updateComment(int, User, CommentDTO): Comment` | Editar (só dono) |
| `deleteComment(int, User): void` | Apagar (só dono) |
| `deleteCommentAdmin(int): void` | Apagar qualquer (admin) |

### BazeService
**Atributos:** `PublicationRepository $publicationRepository`, `BazeRepository $bazeRepository`
| Método | Descrição |
|---|---|
| `publicationLike(User, int): Baze` | Dar like (criar baze) |
| `publicationRemoveLike(User, int): void` | Remover like (apagar baze) |
| `getAllBazes(): Collection` | Listar todos bazes |

---

## 6. Repositories (Acesso a Dados)

### Padrão Repetitivo em TODOS os Repositories

| Método Comum | Presente em |
|---|---|
| `findById(int): ?Model` | Todos |
| `create(array): Model` | Todos |
| `update(Model, array): Model` | Todos (menos BazeRepository) |
| `delete(Model): void` | Todos (menos BazeRepository que faz delete por ID) |

### UserRepository
| Método | Descrição |
|---|---|
| `findByEmail(string): ?User` | Buscar por email |
| `findById(int): ?User` | Buscar por ID |
| `search(string): Collection` | Pesquisar por nome |
| `create(array): User` | Criar user |
| `update(User, array): User` | Atualizar |
| `delete(User): void` | Apagar |
| `deleteUser(User): void` | Apagar (método separado) |
| `follow(User, int): void` | Inserir na pivot followers |
| `unfollow(User, int): void` | Remover da pivot |
| `count(): int` | Total users |
| `mostPublications(): Collection` | User com mais publicações |
| `countPublicationsAndFollowers(): Collection` | Listar com contagens |
| `promoteRepository(int): void` | Mudar role para admin |

### PublicationRepository
| Método | Descrição |
|---|---|
| `findById(int): ?Publication` | Buscar por ID |
| `getAll(User): Collection` | Listar (com verificação de like) |
| `getByUserId(int): Collection` | Publicações de user |
| `create(array): Publication` | Criar |
| `update(Publication, array): Publication` | Atualizar |
| `delete(Publication): void` | Apagar |
| `count(): int` | Total |

### CommentRepository
| Método | Descrição |
|---|---|
| `findById(int): ?Comment` | Buscar por ID |
| `getByPublicationId(int): Collection` | Comentários de uma pub |
| `getAll(): Collection` | Todos comentários |
| `create(array): Comment` | Criar |
| `update(Comment, array): Comment` | Atualizar |
| `delete(Comment): void` | Apagar |
| `count(): int` | Total |

### BazeRepository
| Método | Descrição |
|---|---|
| `findById(int): ?Baze` | Buscar por ID |
| `findByPubIdAndUserId(int, int): ?Baze` | Verificar se user já deu like |
| `all(): Collection` | Todos bazes |
| `create(array): Baze` | Criar |
| `delete(Baze): void` | Apagar |

---

## 7. Relacionamentos entre Classes (Diagrama)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│   User      │────→│ Publication  │────→│   Comment   │     │   Baze   │
│             │     │              │     │             │     │          │
│ id (PK)     │     │ id (PK)      │     │ id (PK)     │     │ id (PK)  │
│ nome        │     │ user_id (FK) │     │ user_id(FK) │     │ user(FK) │
│ email       │     │ texto        │     │ pub_id(FK)  │     │ pub(FK)  │
│ password    │     │ imagem       │     │ texto       │     │          │
│ foto_perfil │     │ video        │     │             │     │          │
│ privacidade │     │              │     │             │     │          │
│ role        │     │              │     │             │     │          │
└──────┬──────┘     └──────────────┘     └─────────────┘     └──────────┘
       │
       ├── followers (pivot: user_id, follower_id)
       │
       └── bazes (relaciona User ↔ Publication)
```

### Cardinalidades

| Origem | Destino | Cardinalidade | Descrição |
|---|---|---|---|
| User | Publication | 1 → N | Um user tem muitas publicações |
| Publication | User | N → 1 | Publicação pertence a um user |
| User | Comment | 1 → N | Um user tem muitos comentários |
| Publication | Comment | 1 → N | Uma publicação tem muitos comentários |
| User | User (followers) | N ↔ N | Um user segue muitos users e é seguido |
| User | Baze | 1 → N | Um user dá muitos likes |
| Publication | Baze | 1 → N | Uma publicação recebe muitos likes |

---

## 8. Resumo de Padrões Repetitivos Identificados

### Nos Models
- `use HasFactory` em todos
- `protected $fillable` em todos
- Relacionamentos `belongsTo` / `hasMany` em todos
- Timestamps automáticos

### Nos DTOs
- `public readonly` em todos os atributos
- `fromRequest(Request): self` — factory estática idêntica em todos

### Nos Requests
- `authorize(): bool` — sempre retorna `true`
- `rules(): array` — estrutura idêntica, variam apenas as regras

### Nos Controllers
- Todos `extends Controller`
- Injecção do Service via construtor (`protected Service $service`)
- CRUD padronizado: `index`, `store`, `show`, `update`, `destroy`
- Métodos extra comuns: `contar()`, `deletar()` (admin)
- Retorno sempre `JsonResponse`

### Nos Services
- Todos recebem Repository(ies) no construtor
- Métodos: `getAll`, `getById`, `create`, `update`, `delete`
- Operações de admin separadas (ex: `deletePublicationAny`, `deleteCommentAdmin`)

### Nos Repositories
- `findById(int): ?Model` — padrão em todos
- CRUD: `create`, `update`, `delete` — mesmas assinaturas em todos
- Métodos específicos variam conforme a entidade
