# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## REGRA ABSOLUTA — Git e GitHub

**NUNCA execute operações git de forma autônoma, sob nenhuma circunstância.**

Isso inclui — mas não se limita a:

```
git add          git commit       git push         git pull
git merge        git rebase       git reset        git checkout
git branch -D    git tag          git stash        gh pr create
gh issue create  gh repo create
```

**Toda e qualquer operação de controle de versão é responsabilidade exclusiva do usuário.**

---

## Project Overview

Academic assignment (DR1-AT) — Sistema de Gestão Hospitalar.

Manages patients, doctors, appointments and hospitalizations with **PostgreSQL** as the sole relational persistence.

Domain entities:
- **Paciente** — id, nome, CPF, dataNascimento, telefone → many Consultas + many Internacoes
- **Medico** — id, nome, CRM, especialidade → many Consultas
- **Consulta** — id, dataConsulta, observacoes → ManyToOne Paciente + ManyToOne Medico
- **Internacao** — id, dataEntrada, dataAlta, quarto → ManyToOne Paciente

## Tech Stack

- **Language:** Java 25
- **Build system:** Maven 3.9.16 (`.mvn/wrapper/maven-wrapper.properties`)
- **Framework:** Spring Boot 4.0.6
- **Libraries:** Lombok, Spring Web, Spring Data JPA, PostgreSQL, Spring Boot Validation, Spring Boot Actuator, Spring Security, DevTools
- **Testing:** JUnit 5, Mockito, MockMvc (H2 in-memory for test profile)
- **Frontend:** React 19 + Vite 8 + react-router-dom 7 + @tabler/icons-react 3
- **Docker:** Dockerfile (multi-stage, eclipse-temurin:25) + docker-compose.yml (postgres:18.4-alpine + app)
- **IDE:** IntelliJ IDEA

## Build & Run

```bash
# Pré-requisito: PostgreSQL rodando (via Docker Compose ou local)
docker-compose up -d postgres

# Rodar a aplicação (porta 8090)
mvn spring-boot:run

# Rodar os testes (usa H2 em memória — sem PostgreSQL necessário)
mvn test

# Build completo (gera JAR)
mvn package

# Executar o JAR
java -jar target/hospital-1.0.0.jar

# Ambiente completo (app + postgres) com Docker Compose
docker-compose up --build
```

Application starts on: **http://localhost:8090**

**Security — HTTP Basic:**
- `admin` / `admin123` → role ADMIN (leitura + escrita + exclusão)
- `user` / `user123` → role USER (apenas leitura)
- `/actuator/health` → público (sem autenticação)

**Actuator:** http://localhost:8090/actuator/health

## Project Structure

```
src/
  main/java/com/hospital/
    HospitalApplication.java                      # @SpringBootApplication — entry point
    config/
      DataInitializer.java                        # CommandLineRunner — seeds Médicos + Pacientes
      SecurityConfig.java                         # Spring Security — HTTP Basic, roles, BCrypt, CORS (frontend :5173)
    controllers/
      PacienteController.java                     # POST /pacientes · GET /pacientes/{id} · GET /pacientes · DELETE /pacientes/{id}
      MedicoController.java                       # POST /medicos · GET /medicos · GET /medicos/ranking
      ConsultaController.java                     # POST /consultas · GET /consultas
      InternacaoController.java                   # POST /internacoes · GET /internacoes
    services/
      PacienteService.java                        # cadastrar · buscarPorId · listar · remover
      MedicoService.java                          # cadastrar · listar · rankingPorConsultas
      ConsultaService.java                        # cadastrar
      InternacaoService.java                      # cadastrar
    models/
      Paciente.java                               # @Entity — id, nome, cpf, dataNascimento, telefone
      Medico.java                                 # @Entity — id, nome, crm, especialidade
      Consulta.java                               # @Entity — id, dataConsulta, observacoes · @ManyToOne Paciente+Medico
      Internacao.java                             # @Entity — id, dataEntrada, dataAlta, quarto · @ManyToOne Paciente
    repositories/
      PacienteRepository.java                     # JpaRepository<Paciente, Long>
      MedicoRepository.java                       # JpaRepository + @Query JPQL ranking por consultas
      ConsultaRepository.java                     # JpaRepository<Consulta, Long>
      InternacaoRepository.java                   # JpaRepository<Internacao, Long>
    dtos/
      PacienteRequestDTO.java                     # nome, cpf, dataNascimento, telefone (com @Valid)
      PacienteResponseDTO.java                    # id, nome, cpf, dataNascimento, telefone
      MedicoRequestDTO.java                       # nome, crm, especialidade (com @Valid)
      MedicoResponseDTO.java                      # id, nome, crm, especialidade
      MedicoRankingDTO.java                       # id, nome, crm, especialidade, totalConsultas (JPQL projection)
      ConsultaRequestDTO.java                     # dataConsulta, observacoes, pacienteId, medicoId
      ConsultaResponseDTO.java                    # id, dataConsulta, observacoes, pacienteId, nomePaciente, medicoId, nomeMedico, especialidadeMedico
      InternacaoRequestDTO.java                   # dataEntrada, dataAlta, quarto, pacienteId
      InternacaoResponseDTO.java                  # id, dataEntrada, dataAlta, quarto, pacienteId, nomePaciente
    exception/
      GlobalExceptionHandler.java                 # @RestControllerAdvice — trata ResponseStatusException + MethodArgumentNotValidException
  main/resources/
    application.properties                        # PostgreSQL, ddl-auto=update, Actuator
  test/java/com/hospital/
    HospitalApplicationTests.java                 # context load (@ActiveProfiles("test"))
    service/
      PacienteServiceTest.java                    # 6 testes unitários (Mockito)
      MedicoServiceTest.java                      # 3 testes unitários (Mockito)
    controller/
      PacienteControllerTest.java                 # 6 testes de integração (MockMvc + @SpringBootTest)
  test/resources/
    application-test.properties                   # H2 em memória para testes
frontend/                                         # design system light inspirado em Meta/MiniMax
  package.json                                    # React 19, react-router-dom 7, @tabler/icons-react 3, vite 8
  vite.config.js
  index.html                                      # favicon.svg (cruz), Google Fonts (DM Sans + Outfit)
  public/
    favicon.svg                                   # cruz médica — brand blue #0064E0
    videos/                                       # 3 clipes .mp4 otimizados (hero em loop)
  src/
    main.jsx
    App.jsx                                        # Navbar + main (Routes) + Footer
    api.js                                        # fetch wrapper com Basic Auth (user/admin)
    index.css                                     # design tokens: DM Sans+Outfit, pills, vidro fosco, fundo com imagem
    assets/
      ricardo-gomez-angel-cq4UJnEhh54-unsplash.jpg # imagem de fundo da página (Unsplash)
    components/
      Navbar.jsx                                  # NavLink + ícones Tabler + badge do logo
      Footer.jsx                                  # footer clean multi-coluna (nav, recursos, sobre, social, créditos)
      VideoHero.jsx                               # hero com vídeo em loop (3 clipes) + play/pause + dots
      Modal.jsx                                   # modal reutilizável
      Toast.jsx                                   # notificações toast (ícones Tabler)
    pages/
      Dashboard.jsx                               # hero (imagem) + stat cards + module cards
      Pacientes.jsx                               # listar + cadastrar + remover
      Medicos.jsx                                 # listar + cadastrar
      Consultas.jsx                               # cadastrar com selects de paciente/médico
      Internacoes.jsx                             # cadastrar com select de paciente
      Ranking.jsx                                 # ranking médicos por consultas (JPQL)
Dockerfile                                        # multi-stage: eclipse-temurin:25-jdk → eclipse-temurin:25-jre
docker-compose.yml                                # serviços: postgres + app (healthcheck, depends_on, volume)
doc/
  RELATORIO_AT.md                                 # relatório técnico completo (12 exercícios + 6 rúbricas)
CLAUDE.md
LICENSE                                           # MIT
.gitignore
README.md
```

## Frontend — Design

Linguagem visual light, clean e premium:
- **Cores:** azul `#0064E0` (brand) + sky `#3DAEFF` + accent pink `#EA5EC1`; superfícies brancas/cinza-claro
- **Tipografia:** DM Sans (UI/corpo) + Outfit (display/títulos) via Google Fonts
- **Fundo da página:** imagem arquitetônica `ricardo-gomez-angel-cq4UJnEhh54-unsplash.jpg` (assets) + overlay gradiente claro
- **VideoHero:** Dashboard com vídeo em loop (3 clipes `.mp4` em `public/videos/`, alterna no `onEnded`, botão play/pause + dots)
- **Componentes:** botões pill (9999px), cards em vidro fosco (translúcido + blur), navbar e footer clean
- **Footer:** branco, multi-coluna (Navegação/Recursos/Sobre) + ícones sociais GitHub/LinkedIn (placeholders) + créditos
- **Ícones:** `@tabler/icons-react` padronizado em toda a UI
- **Favicon:** `public/favicon.svg` — cruz médica em brand blue
- **Vídeos:** otimizados para web (H.264, ~0,6–1,7 MB cada); originais brutos em `src/assets` ignorados no git
- **CORS:** `SecurityConfig` libera `http://localhost:5173` (origem do Vite) com preflight `OPTIONS`

## REST API

| Method | Endpoint               | Auth         | Status | Description                                      |
|--------|------------------------|--------------|--------|--------------------------------------------------|
| POST   | `/pacientes`           | ADMIN        | 201    | Cadastrar paciente                               |
| GET    | `/pacientes/{id}`      | USER, ADMIN  | 200    | Buscar paciente por ID                           |
| GET    | `/pacientes`           | USER, ADMIN  | 200    | Listar todos os pacientes                        |
| DELETE | `/pacientes/{id}`      | ADMIN        | 204    | Remover paciente                                 |
| POST   | `/medicos`             | ADMIN        | 201    | Cadastrar médico                                 |
| GET    | `/medicos`             | USER, ADMIN  | 200    | Listar médicos                                   |
| GET    | `/medicos/ranking`     | USER, ADMIN  | 200    | Ranking por nº de consultas (JPQL ORDER BY DESC) |
| POST   | `/consultas`           | ADMIN        | 201    | Registrar consulta                               |
| GET    | `/consultas`           | USER, ADMIN  | 200    | Listar consultas                                 |
| POST   | `/internacoes`         | ADMIN        | 201    | Registrar internação                             |
| GET    | `/internacoes`         | USER, ADMIN  | 200    | Listar internações                               |
| GET    | `/actuator/health`     | Público      | 200    | Spring Boot Actuator health check                |

**Error responses:**
- `400 Bad Request` — validação Bean Validation falhou (`@Valid` + `GlobalExceptionHandler`)
- `401 Unauthorized` — sem autenticação
- `403 Forbidden` — autenticado mas sem permissão (ex.: role USER tentando POST)
- `404 Not Found` — entidade referenciada não existe (`ResponseStatusException`)

## Architecture Guidelines

Mesmos princípios do TP3 (SOLID, DRY, YAGNI, DDD, Sem overengineering).

- Controller → Service → Repository (três camadas, sem bypass)
- JPA entities usam `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder` (NÃO `@Data`) — evita circular `toString`/`equals` em relacionamentos bidirecionais
- DTOs usam `@Data @NoArgsConstructor @AllArgsConstructor` — seguro (sem relacionamentos)
- Services usam `@RequiredArgsConstructor` (constructor injection com `private final`)
- `toResponseDTO(Entidade)` em cada service é o único ponto de conversão entidade → DTO
- `ResponseStatusException` para erros conhecidos — sem custom exception classes além do `GlobalExceptionHandler`
- `@Valid` nos controllers — `GlobalExceptionHandler` captura `MethodArgumentNotValidException`

## Security Design

- HTTP Basic Authentication (adequado para API acadêmica)
- Dois usuários em memória: `admin` (ROLE_ADMIN) e `user` (ROLE_USER)
- BCryptPasswordEncoder para hashing de senhas
- CSRF desabilitado (API REST stateless — sem sessões)
- `/actuator/health` público — necessário para health check Docker
- Rotas GET abertas para USER e ADMIN; escritas (POST/DELETE) restritas a ADMIN
- Testes de integração usam `SecurityMockMvcRequestPostProcessors.httpBasic()`

## Testing Strategy

**Testes unitários** (`@ExtendWith(MockitoExtension.class)`) — sem Spring context:
- `PacienteServiceTest`: cadastrar, buscarPorId, listar, remover (sucesso), remover (não existe), buscarPorId (não existe)
- `MedicoServiceTest`: cadastrar, listar, listar vazio

**Testes de integração** (`@SpringBootTest + @AutoConfigureMockMvc + @ActiveProfiles("test")`) — com H2 em memória:
- `PacienteControllerTest`: cadastrar (201), buscar (200), listar (200), excluir (204), sem auth (401), USER tentando POST (403)

## Docker

**Dockerfile** — multi-stage build:
1. `eclipse-temurin:25-jdk` — compila e empacota (`mvn package -DskipTests`)
2. `eclipse-temurin:25-jre` — imagem final com apenas o JAR

**docker-compose.yml** — dois serviços:
- `postgres` — `postgres:18.4-alpine` com healthcheck `pg_isready`
- `app` — build local, `depends_on: postgres: condition: service_healthy`
- Volume `hospital_data` para persistência PostgreSQL

```bash
docker-compose up --build   # sobe tudo (app + postgres)
docker-compose down -v      # para e remove volumes
```

## Data Initialization (CommandLineRunner)

`DataInitializer` executa `if (count() == 0)` antes de inserir — idempotente com `ddl-auto=update`.

Médicos inseridos na inicialização:
- `Dr. Carlos Menezes` — CRM-12345/SP — Cardiologista
- `Dra. Ana Ferreira` — CRM-67890/RJ — Ortopedista

Pacientes inseridos na inicialização:
- `João Silva` — CPF 12345678901
- `Maria Oliveira` — CPF 98765432100

## Spring Boot 4.0.x — Armadilhas conhecidas (validadas neste projeto)

Diferenças em relação ao Spring Boot 3.x que quebram código copiado de tutoriais antigos:

1. **MockMvc não vem no `spring-boot-starter-test`.** O módulo Web MVC Test foi separado.
   É preciso adicionar `spring-boot-webmvc-test` (test scope) ao pom.xml.
   - `@AutoConfigureMockMvc` migrou de `org.springframework.boot.test.autoconfigure.web.servlet`
     para **`org.springframework.boot.webmvc.test.autoconfigure`**.

2. **Jackson 3** (não Jackson 2). O `ObjectMapper` agora é **`tools.jackson.databind.ObjectMapper`**
   (não `com.fasterxml.jackson.databind.ObjectMapper`). `writeValueAsString`/`readTree` mantêm a API.

3. **Actuator** usa modelo de acesso por endpoint: `management.endpoints.access.default` e
   `management.endpoint.health.access` (a propriedade `management.endpoints.web.exposure.include` foi removida).

4. **Docker + `server.address`:** `server.address=127.0.0.1` no `application.properties` faz a app
   escutar apenas no loopback do container — o mapeamento de porta do Docker não a alcança.
   O `docker-compose.yml` sobrescreve com `SERVER_ADDRESS=0.0.0.0` (isolamento de rede do container
   já fornece a segurança). O `application.properties` mantém `127.0.0.1` para execução local segura.

5. **Maven no Dockerfile:** baixe de `repo.maven.apache.org` (Maven Central — mantém todas as versões),
   não de `downloads.apache.org` (só guarda a versão atual → `exit code 8` ao buscar versões antigas).

**Status de validação:** `mvn test` → 16 testes passando. `docker compose up --build` → stack completo
(PostgreSQL + app) sobe, `/actuator/health` retorna `UP` com `db: PostgreSQL UP`, e o fluxo completo da API
foi validado (401/403/201/200/404/400/204, ranking JPQL, internação).

## Versions (all pinned)

| Artifact         | Version                          |
|------------------|----------------------------------|
| Spring Boot      | 4.0.6                            |
| Java             | 25                               |
| Maven            | 3.9.16                           |
| PostgreSQL driver | managed by Spring Boot 4.0.6 BOM |
| Lombok, Security, Validation, Actuator | managed by BOM |

## SOLID / DDD (mesmos princípios do TP3 — aplicados ao domínio hospitalar)

- **Linguagem ubíqua:** `Paciente`, `Medico`, `Consulta`, `Internacao`, `cadastrar`, `remover`, `listar`, `rankingPorConsultas`
- **Separação por domínio:** `models/`, `repositories/`, `services/`, `controllers/`, `dtos/`, `config/`, `exception/`
- **SRP:** cada classe tem uma única razão para mudar
- **DIP:** controllers dependem de `PacienteService` (interface implícita via Spring IoC), não de implementações concretas

## JPQL Query — Ranking de Médicos (Exercício 9)

```jpql
SELECT new com.hospital.dtos.MedicoRankingDTO(m.id, m.nome, m.crm, m.especialidade, COUNT(c))
FROM Consulta c JOIN c.medico m
GROUP BY m.id, m.nome, m.crm, m.especialidade
ORDER BY COUNT(c) DESC
```

Constructor expression projeta diretamente para `MedicoRankingDTO` — sem mapeamento intermediário.

---

## Regras de Trabalho (herdadas do TP3)

- Leia antes de editar
- Nunca delete arquivos sem confirmação
- Não altere pom.xml, application.properties, .gitignore, CLAUDE.md sem solicitação direta
- Não crie arquivos `.md` adicionais além dos existentes
- Não exponha credenciais reais em código ou arquivos de configuração
- Nunca execute operações git de forma autônoma
