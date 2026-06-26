<!-- ╔══════════════════════════ HEADER (banner wave animado) ══════════════════════════╗ -->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0064E0,100:3DAEFF&height=210&section=header&text=Hospital&fontSize=58&fontColor=ffffff&fontAlignY=36&desc=Sistema%20de%20Gest%C3%A3o%20Hospitalar%20%C2%B7%20DR1-AT&descAlignY=58&descSize=18" width="100%" />

[![Typing SVG](https://readme-typing-svg.demolab.com?font=DM+Sans&weight=600&size=21&pause=1000&color=0064E0&center=true&vCenter=true&width=600&lines=API+REST+com+Spring+Boot+%2B+PostgreSQL;Pacientes+%C2%B7+M%C3%A9dicos+%C2%B7+Consultas+%C2%B7+Interna%C3%A7%C3%B5es;Frontend+React+com+v%C3%ADdeo+em+loop+no+hero)](#-hospital--sistema-de-gestão-hospitalar)

<!-- ⬇️ Substitua os links abaixo pelos SEUS endereços de GitHub e LinkedIn ⬇️ -->
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/andrebecker84)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/becker84)

<br/>

# 🏥 Hospital · Sistema de Gestão Hospitalar

**API REST para gestão de pacientes, médicos, consultas e internações**

<sub>DR1-AT · Engenharia de Softwares Escaláveis</sub>

<br/>

![Java](https://img.shields.io/badge/Java-25-007396?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-HTTP%20Basic-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tabler Icons](https://img.shields.io/badge/Tabler%20Icons-3-0054A6?style=flat-square&logo=tabler&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

![Tests](https://img.shields.io/badge/tests-16%2F16%20passing-16a34a?style=flat-square&logo=junit5&logoColor=white)
![Build](https://img.shields.io/badge/build-success-16a34a?style=flat-square&logo=apachemaven&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-8957e5?style=flat-square)

[![Relatório Técnico](https://img.shields.io/badge/Relat%C3%B3rio%20T%C3%A9cnico-DR1--AT-0064E0?style=for-the-badge&logo=googledocs&logoColor=white)](https://github.com/andrebecker84/servicesAT/blob/main/doc/RELATORIO_AT.md)

<sub>Frontend React com vídeo em loop no hero · tipografia DM Sans + Outfit · ícones Tabler</sub>

</div>

---

## <img src="https://api.iconify.design/tabler/list-search.svg?color=%230064E0" width="20" align="center" /> Índice

1. [Visão Geral](#-visão-geral)
2. [Stack Tecnológica](#-stack-tecnológica)
3. [Pré-requisitos](#-pré-requisitos)
4. [Início Rápido](#-início-rápido)
5. [Frontend](#-frontend)
6. [Autenticação](#-autenticação)
7. [Referência da API](#-referência-da-api)
8. [Modelo de Domínio](#-modelo-de-domínio)
9. [Dados Iniciais](#-dados-iniciais)
10. [Testes](#-testes)
11. [Deploy com Docker](#-deploy-com-docker)
12. [Estrutura do Projeto](#-estrutura-do-projeto)
13. [Créditos](#-créditos)
14. [Relatório Técnico](https://github.com/andrebecker84/servicesAT/blob/main/doc/RELATORIO_AT.md)

---

## <img src="https://api.iconify.design/tabler/building-hospital.svg?color=%230064E0" width="20" align="center" /> Visão Geral

Um hospital precisa gerenciar **pacientes**, **médicos**, **consultas** e **internações**.
Esta API REST resolve o problema com uma arquitetura limpa em **três camadas**
(`Controller → Service → Repository`), **PostgreSQL** como banco relacional principal,
**Spring Security** protegendo os endpoints e um **frontend React** para interação visual.

```mermaid
flowchart LR
    UI["🖥️ Frontend React<br/>(Vite · :5173)"] -->|HTTP Basic + CORS| API
    subgraph API["⚙️ Spring Boot · :8090"]
        direction TB
        C["Controller<br/>@RestController"] --> S["Service<br/>@Service"]
        S --> R["Repository<br/>JpaRepository"]
    end
    R -->|JDBC| DB[("🐘 PostgreSQL<br/>:5432")]
```

---

## <img src="https://api.iconify.design/tabler/stack-2.svg?color=%230064E0" width="20" align="center" /> Stack Tecnológica

| Camada           | Tecnologia                                         |
|------------------|----------------------------------------------------|
| Linguagem        | Java 25 (LTS)                                       |
| Framework        | Spring Boot 4.0.6                                   |
| Persistência     | Spring Data JPA + PostgreSQL 18                     |
| Segurança        | Spring Security (HTTP Basic + BCrypt + CORS)        |
| Validação        | Spring Boot Validation (Bean Validation)           |
| Observabilidade  | Spring Boot Actuator (`/actuator/health`)          |
| Build            | Maven 3.9.16 (Wrapper)                             |
| Testes           | JUnit 5 · Mockito · MockMvc · H2 (perfil de teste) |
| Frontend         | React 19 · Vite 8 · React Router 7 · Tabler Icons 3 |
| Containers       | Docker · Docker Compose                            |

---

## <img src="https://api.iconify.design/tabler/checklist.svg?color=%230064E0" width="20" align="center" /> Pré-requisitos

- **Java 25+**
- **Maven 3.9.16+** (ou use o wrapper `./mvnw`)
- **Docker** + **Docker Compose** · para PostgreSQL e deploy
- **Node.js 20+** · para o frontend

---

## <img src="https://api.iconify.design/tabler/rocket.svg?color=%230064E0" width="20" align="center" /> Início Rápido

### 1. Subir o PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Rodar a aplicação

```bash
./mvnw spring-boot:run
```

> A API sobe em <kbd>http://localhost:8090</kbd>

### 3. Verificar a saúde

```bash
curl http://localhost:8090/actuator/health
```

### 4. Ambiente completo (app + banco) em um comando

```bash
docker compose up --build
```

<details>
<summary><b>Outros comandos úteis</b></summary>

```bash
./mvnw test                      # roda os testes (H2 em memória, não precisa de PostgreSQL)
./mvnw package -DskipTests       # gera o JAR executável
java -jar target/hospital-1.0.0.jar   # executa o JAR
docker compose down -v           # para tudo e apaga os dados
```
</details>

---

## <img src="https://api.iconify.design/tabler/device-desktop.svg?color=%230064E0" width="20" align="center" /> Frontend

```bash
cd frontend
npm install
npm run dev
```

> Acesse <kbd>http://localhost:5173</kbd>

| Página       | Recurso                                                  |
|--------------|----------------------------------------------------------|
| Dashboard    | Hero com vídeo em loop · health check · estatísticas      |
| Pacientes    | Listar · cadastrar · remover                             |
| Médicos      | Listar · cadastrar                                       |
| Consultas    | Registrar consulta (paciente + médico)                   |
| Internações  | Registrar internação                                     |
| Ranking      | Médicos por nº de consultas (query JPQL)                 |

**Destaques visuais:** hero com **vídeo em loop** (3 clipes otimizados), imagem de fundo, cards em vidro fosco, navbar e footer clean, ícones [Tabler](https://tabler.io/icons) e tipografia DM Sans + Outfit.

> [!NOTE]
> O frontend (`:5173`) acessa a API (`:8090`) via **CORS** configurado no `SecurityConfig`.

---

## <img src="https://api.iconify.design/tabler/lock.svg?color=%230064E0" width="20" align="center" /> Autenticação

Autenticação **HTTP Basic** com dois usuários em memória (senhas com **BCrypt**):

| Usuário | Senha      | Papel                                                          | Permissões                   |
|---------|------------|----------------------------------------------------------------|------------------------------|
| `admin` | `admin123` | ![ADMIN](https://img.shields.io/badge/ADMIN-dc2626?style=flat-square) | leitura + escrita + exclusão |
| `user`  | `user123`  | ![USER](https://img.shields.io/badge/USER-2563eb?style=flat-square)   | apenas leitura (GET)         |

> [!IMPORTANT]
> O endpoint `GET /actuator/health` é **público** (necessário para o healthcheck do Docker).
> Tentativas sem autenticação retornam `401`; autenticado sem permissão retorna `403`.

---

## <img src="https://api.iconify.design/tabler/api.svg?color=%230064E0" width="20" align="center" /> Referência da API

> Legenda de métodos &nbsp;
> ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square)
> ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square)
> ![PUT](https://img.shields.io/badge/PUT-d97706?style=flat-square)
> ![DELETE](https://img.shields.io/badge/DELETE-dc2626?style=flat-square)

### <img src="https://api.iconify.design/tabler/users.svg?color=%230064E0" width="16" align="center" /> Pacientes

| Método | Endpoint | Auth | Resposta | Descrição |
|--------|----------|------|----------|-----------|
| ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | `/pacientes` | `ADMIN` | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) | Cadastrar paciente |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/pacientes` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Listar pacientes |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/pacientes/{id}` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) ![404](https://img.shields.io/badge/404-dc2626?style=flat-square) | Buscar por ID |
| ![DELETE](https://img.shields.io/badge/DELETE-dc2626?style=flat-square) | `/pacientes/{id}` | `ADMIN` | ![204](https://img.shields.io/badge/204-16a34a?style=flat-square) ![404](https://img.shields.io/badge/404-dc2626?style=flat-square) | Remover paciente |

### <img src="https://api.iconify.design/tabler/stethoscope.svg?color=%230064E0" width="16" align="center" /> Médicos

| Método | Endpoint | Auth | Resposta | Descrição |
|--------|----------|------|----------|-----------|
| ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | `/medicos` | `ADMIN` | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) | Cadastrar médico |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/medicos` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Listar médicos |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/medicos/ranking` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Ranking por nº de consultas (JPQL) |

### <img src="https://api.iconify.design/tabler/calendar-check.svg?color=%230064E0" width="16" align="center" /> Consultas & <img src="https://api.iconify.design/tabler/bed.svg?color=%230064E0" width="16" align="center" /> Internações

| Método | Endpoint | Auth | Resposta | Descrição |
|--------|----------|------|----------|-----------|
| ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | `/consultas` | `ADMIN` | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) ![404](https://img.shields.io/badge/404-dc2626?style=flat-square) | Registrar consulta |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/consultas` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Listar consultas |
| ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | `/internacoes` | `ADMIN` | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) ![404](https://img.shields.io/badge/404-dc2626?style=flat-square) | Registrar internação |
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/internacoes` | `USER` `ADMIN` | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Listar internações |

### <img src="https://api.iconify.design/tabler/heartbeat.svg?color=%230064E0" width="16" align="center" /> Actuator

| Método | Endpoint | Auth | Resposta | Descrição |
|--------|----------|------|----------|-----------|
| ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | `/actuator/health` | ![público](https://img.shields.io/badge/p%C3%BAblico-16a34a?style=flat-square) | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | Health check |

### Códigos de status retornados

![200](https://img.shields.io/badge/200-OK-16a34a?style=flat-square)
![201](https://img.shields.io/badge/201-Created-16a34a?style=flat-square)
![204](https://img.shields.io/badge/204-No%20Content-16a34a?style=flat-square)
![400](https://img.shields.io/badge/400-Bad%20Request-d97706?style=flat-square)
![401](https://img.shields.io/badge/401-Unauthorized-ea580c?style=flat-square)
![403](https://img.shields.io/badge/403-Forbidden-ea580c?style=flat-square)
![404](https://img.shields.io/badge/404-Not%20Found-dc2626?style=flat-square)

<details>
<summary><b>Exemplos de requisição (cURL)</b></summary>

```bash
# Cadastrar paciente (ADMIN) → 201
curl -u admin:admin123 -X POST http://localhost:8090/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Souza","cpf":"55544433322","dataNascimento":"1980-01-01","telefone":"(11) 90000-0000"}'

# Listar pacientes (USER) → 200
curl -u user:user123 http://localhost:8090/pacientes

# Registrar consulta (ADMIN) → 201
curl -u admin:admin123 -X POST http://localhost:8090/consultas \
  -H "Content-Type: application/json" \
  -d '{"dataConsulta":"2026-06-24T10:00:00","observacoes":"Check-up","pacienteId":1,"medicoId":1}'

# Ranking de médicos (JPQL) → 200
curl -u user:user123 http://localhost:8090/medicos/ranking
```
</details>

---

## <img src="https://api.iconify.design/tabler/schema.svg?color=%230064E0" width="20" align="center" /> Modelo de Domínio

```mermaid
erDiagram
    PACIENTE  ||--o{ CONSULTA    : possui
    MEDICO    ||--o{ CONSULTA    : realiza
    PACIENTE  ||--o{ INTERNACAO  : possui

    PACIENTE {
        Long id PK
        String nome
        String cpf UK
        LocalDate dataNascimento
        String telefone
    }
    MEDICO {
        Long id PK
        String nome
        String crm UK
        String especialidade
    }
    CONSULTA {
        Long id PK
        LocalDateTime dataConsulta
        String observacoes
        Long paciente_id FK
        Long medico_id FK
    }
    INTERNACAO {
        Long id PK
        LocalDate dataEntrada
        LocalDate dataAlta
        String quarto
        Long paciente_id FK
    }
```

---

## <img src="https://api.iconify.design/tabler/database-cog.svg?color=%230064E0" width="20" align="center" /> Dados Iniciais

Inseridos automaticamente na inicialização (`CommandLineRunner`, idempotente). O seed popula a
plataforma com dados realistas para demonstração: **12 médicos** (12 especialidades), **8 pacientes**,
**28 consultas** e **4 internações** (alimentando o ranking Top 10, as listagens e as estatísticas).

<table>
<tr><th>Médicos (exemplos)</th><th>Pacientes (exemplos)</th></tr>
<tr><td>

- Dr. Carlos Menezes · `CRM-12345/SP` · Cardiologista
- Dra. Ana Ferreira · `CRM-67890/RJ` · Ortopedista
- Dra. Beatriz Lima · Pediatra · Dr. Rafael Souza · Neurologista
- + Dermatologista, Ginecologista, Oncologista, Psiquiatra
- + Endocrinologista, Urologista, Oftalmologista, Reumatologista

</td><td>

- João Silva · CPF `12345678901`
- Maria Oliveira · CPF `98765432100`
- Pedro Santos · Juliana Costa · Lucas Pereira
- Carla Mendes · Bruno Carvalho · Fernanda Dias

</td></tr>
</table>

---

## <img src="https://api.iconify.design/tabler/test-pipe.svg?color=%230064E0" width="20" align="center" /> Testes

```bash
./mvnw test
```

![Tests](https://img.shields.io/badge/16%2F16-passing-16a34a?style=flat-square&logo=junit5&logoColor=white)

| Tipo | Classe | Casos | Ferramentas |
|------|--------|:-----:|-------------|
| Unitário   | `PacienteServiceTest` | 6 | JUnit 5 · Mockito |
| Unitário   | `MedicoServiceTest`   | 3 | JUnit 5 · Mockito |
| Integração | `PacienteControllerTest` | 6 | `@SpringBootTest` · MockMvc · H2 |
| Contexto   | `HospitalApplicationTests` | 1 | `@SpringBootTest` |

Os testes de integração validam **status HTTP**, **estrutura JSON** e **persistência real**
(incluindo `401`/`403` de segurança). Os repositórios nos testes unitários são simulados com **Mock**.

---

## <img src="https://api.iconify.design/tabler/brand-docker.svg?color=%230064E0" width="20" align="center" /> Deploy com Docker

**`Dockerfile`** · *multi-stage build* (JDK + Maven para compilar → JRE enxuto para rodar).
**`docker-compose.yml`** · orquestra **app + PostgreSQL** com rede, volume e healthcheck.

```bash
docker compose up --build
```

```text
✔ Container hospital-postgres   Healthy
✔ Container hospital-app        Started   →  http://localhost:8090
```

> [!TIP]
> O `depends_on` com `condition: service_healthy` garante que a aplicação só inicie
> **após** o PostgreSQL estar pronto.

---

## <img src="https://api.iconify.design/tabler/folder.svg?color=%230064E0" width="20" align="center" /> Estrutura do Projeto

```text
servicesAT/
├── src/main/java/com/hospital/
│   ├── HospitalApplication.java
│   ├── config/        DataInitializer · SecurityConfig
│   ├── controllers/   Paciente · Medico · Consulta · Internacao
│   ├── services/      Paciente · Medico · Consulta · Internacao
│   ├── models/        Paciente · Medico · Consulta · Internacao
│   ├── repositories/  JpaRepository de cada entidade
│   ├── dtos/          Request/Response + MedicoRankingDTO
│   └── exception/     GlobalExceptionHandler (@RestControllerAdvice)
├── src/test/java/com/hospital/
│   ├── service/       PacienteServiceTest · MedicoServiceTest
│   └── controller/    PacienteControllerTest
├── frontend/          React 19 + Vite + Tabler Icons
│   ├── public/videos/    clipes .mp4 otimizados (hero scrollytelling + cards de exames)
│   └── src/
│       ├── pages/         Dashboard · Pacientes · Medicos · Consultas · Internacoes · Ranking
│       ├── components/    Navbar · Footer · ScrollHero · Reveal · StatNumber · Modal · Toast
│       └── assets/        imagens de fundo (Unsplash)
├── http/                 arquivos .http (IntelliJ / VS Code REST Client) + env
├── doc/RELATORIO_AT.md    relatório técnico completo
├── Dockerfile
├── docker-compose.yml
├── LICENSE                MIT
└── README.md
```

> [!TIP]
> A pasta `http/` traz arquivos **`.http`** (Pacientes, Médicos, Consultas, Internações, Actuator)
> prontos para o **IntelliJ HTTP Client** ou a extensão **REST Client** do VS Code, com
> autenticação Basic já configurada em `http-client.env.json`.

---

## <img src="https://api.iconify.design/tabler/copyright.svg?color=%230064E0" width="20" align="center" /> Créditos

**Imagens** (uso gratuito sob a [Licença Unsplash](https://unsplash.com/license)):
- Fundo da página: **[Ricardo Gomez Angel](https://unsplash.com/pt-br/fotografias/pessoas-andando-em-edificio-de-concreto-branco-durante-o-dia-cq4UJnEhh54)** · Kilchberg, Suíça (23/09/2020)
- Seção "Saúde na palma da mão": **[nappy](https://unsplash.com/pt-br/fotografias/uma-pessoa-segurando-um-telefone-1Y7ynoLFFDY)** (27/10/2022)

**Vídeos** (otimizados para web; uso gratuito com atribuição):
- Hero · mãos/conexão: [Pixabay (152798)](https://pixabay.com/videos/couple-lovers-hands-love-street-152798/)
- Hero · pessoas: [cottonbro studio · Pexels (7224949)](https://www.pexels.com/pt-br/video/adultos-vista-traseira-brilhante-luminoso-7224949/)
- Hero / ações · médico e paciente: [Vecteezy (27950720](https://www.vecteezy.com/video/27950720-doctor-male-checks-blood-pressure-with-blood-pressure-and-heart-rate-monitor-with-a-digital-pressure-gauge-in-the-hospital-cardiology-medical-equipment-and-healthcare-awareness-concept) · [42648365](https://www.vecteezy.com/video/42648365-doctor-working-with-patient-in-hospital-closeup-rehabilitation-physiotherapy) · [23860396)](https://www.vecteezy.com/video/23860396-men-s-health-exam-with-doctor-or-psychiatrist-working-with-patient-having-consultation-on-diagnostic-examination-on-male-disease-or-mental-illness-in-medical-clinic-or-hospital-mental-health-service)
- Exames · neurologia: [Pixabay (206173)](https://pixabay.com/videos/brain-mind-knowledge-think-206173/)
- Exames · DNA: [Videezy](https://www.videezy.com/abstract/56587-3d-animation-graphic-of-human-dna-on-computer-screen)
- Exames · cardiovascular: [Pixabay (57691)](https://pixabay.com/videos/blood-vessels-human-body-vein-57691/)
- Exames · análises clínicas: [Tima Miroshnichenko · Pexels (9573756)](https://www.pexels.com/pt-br/video/rotacao-sangue-quimica-close-9573756/)

**Ícones:** [Tabler Icons](https://tabler.io/icons) (MIT) · **Badges:** [Shields.io](https://shields.io/) · **Licença do projeto:** [MIT](LICENSE).

<!-- ╔══════════════════════════ FOOTER (wave + social) ══════════════════════════╗ -->

<div align="center">

### Conecte-se

<!-- ⬇️ Substitua os links abaixo pelos SEUS endereços ⬇️ -->
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/andrebecker84)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/becker84)

<sub>Projeto acadêmico · DR1-AT · Engenharia de Softwares Escaláveis</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3DAEFF,100:0064E0&height=120&section=footer" width="100%" />

</div>
