<div align="center">

<img src="https://api.iconify.design/tabler/report-medical.svg?color=%230ea5e9" width="64" />

# Relatório Técnico · DR1-AT
## Sistema de Gestão Hospitalar

**Disciplina:** Engenharia de Softwares Escaláveis &nbsp;·&nbsp; **Persistência:** PostgreSQL &nbsp;·&nbsp; **Data:** Junho de 2026

<br/>

![Java](https://img.shields.io/badge/Java-25-007396?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Tests](https://img.shields.io/badge/tests-16%2F16-16a34a?style=flat-square&logo=junit5&logoColor=white)

![Exercícios](https://img.shields.io/badge/exerc%C3%ADcios-12%2F12-16a34a?style=flat-square)
![Rúbricas](https://img.shields.io/badge/r%C3%BAbricas-6%2F6-16a34a?style=flat-square)
![Validação](https://img.shields.io/badge/validado-em%20execu%C3%A7%C3%A3o%20real-16a34a?style=flat-square)

</div>

---

## Sumário

1. [Visão Geral e Arquitetura](#1-visão-geral-e-arquitetura)
2. [Ferramenta de Build e Dependências (Exercício 1)](#2-ferramenta-de-build-e-dependências-exercício-1)
3. [Configuração do application.properties (Exercício 2)](#3-configuração-do-applicationproperties-exercício-2)
4. [Entidade Paciente (Exercício 3)](#4-entidade-paciente-exercício-3)
5. [Entidade Medico (Exercício 4)](#5-entidade-medico-exercício-4)
6. [Entidade Consulta e Relacionamentos (Exercício 5)](#6-entidade-consulta-e-relacionamentos-exercício-5)
7. [Entidade Internacao (Exercício 6)](#7-entidade-internacao-exercício-6)
8. [Dados Iniciais com CommandLineRunner (Exercício 7)](#8-dados-iniciais-com-commandlinerunner-exercício-7)
9. [Camadas Service e Controller (Exercício 8)](#9-camadas-service-e-controller-exercício-8)
10. [Consulta Personalizada · Ranking de Médicos (Exercício 9)](#10-consulta-personalizada--ranking-de-médicos-exercício-9)
11. [Testes Unitários (Exercício 10)](#11-testes-unitários-exercício-10)
12. [Testes de Integração (Exercício 11)](#12-testes-de-integração-exercício-11)
13. [Deploy com Docker (Exercício 12)](#13-deploy-com-docker-exercício-12)
14. [Segurança com Spring Security](#14-segurança-com-spring-security)
15. [Princípios de Qualidade Aplicados](#15-princípios-de-qualidade-aplicados)
16. [Evidências de Execução](#16-evidências-de-execução)
17. [Cobertura das Rúbricas](#17-cobertura-das-rúbricas)

---

## 1. Visão Geral e Arquitetura

O sistema implementa uma **API REST** para um hospital gerenciar quatro entidades de domínio:
**Paciente**, **Medico**, **Consulta** e **Internacao**, com **PostgreSQL** como banco relacional
principal e persistência via **Spring Data JPA**.

A arquitetura segue rigorosamente o padrão de **três camadas** (MVC + Repository):

```
HTTP Request
     ▼
Controller (@RestController)  →  recebe HTTP, delega, empacota ResponseEntity
     ▼
Service (@Service)            →  regras de negócio, conversão entidade↔DTO, exceções
     ▼
Repository (JpaRepository)    →  acesso ao PostgreSQL, derived queries, JPQL
     ▼
PostgreSQL
```

A camada de segurança (**Spring Security**, HTTP Basic) protege todos os endpoints exceto o
health check do Actuator. Um `@RestControllerAdvice` centraliza o tratamento de erros.

**Linguagem ubíqua (DDD):** todo o domínio usa termos em português · `Paciente`, `Medico`,
`Consulta`, `Internacao`, `cadastrar`, `buscarPorId`, `listar`, `remover`, `rankingPorConsultas`.

---

## 2. Ferramenta de Build e Dependências (Exercício 1)

### Decisão: Maven 3.9.16 + Java 25

**Maven** foi escolhido sobre Gradle por: (1) padrão consolidado no ecossistema Spring Boot;
(2) `spring-boot-starter-parent` como BOM que gerencia versões transitivas automaticamente;
(3) continuidade com os trabalhos anteriores da disciplina (TP1, TP2, TP3).

Usa-se **Maven 3.9.16** · a versão estável (GA) mais recente. O Maven 4.0.0 ainda está em
*release candidate* (`4.0.0-rc-5`) e altera o modelo do POM, o que traria risco desnecessário
a um projeto avaliado. **Java 25** é o LTS mais recente.

O `maven-enforcer-plugin` garante o ambiente mínimo:

```xml
<requireMavenVersion><version>[3.9.16,)</version></requireMavenVersion>
<requireJavaVersion><version>[25,)</version></requireJavaVersion>
```

### Dependências obrigatórias declaradas no pom.xml

| Dependência                          | Função                                                    |
|--------------------------------------|-----------------------------------------------------------|
| `spring-boot-starter-web`            | API REST, Tomcat embarcado, Jackson 3                     |
| `spring-boot-starter-data-jpa`       | Spring Data JPA, Hibernate, HikariCP                      |
| `postgresql` (runtime)               | Driver JDBC do PostgreSQL                                 |
| `spring-boot-starter-validation`     | Bean Validation (`@NotBlank`, `@NotNull`, `@Valid`)       |
| `spring-boot-starter-actuator`       | Health check e métricas (`/actuator/health`)              |
| `spring-boot-starter-test`           | JUnit 5, Mockito, AssertJ                                 |
| `spring-boot-starter-security`       | Autenticação e autorização (rúbrica 5)                    |
| `spring-security-test`               | Suporte a testes de segurança (`httpBasic()`)             |
| `spring-boot-webmvc-test` (test)     | MockMvc · separado do starter-test no Spring Boot 4       |
| `h2` (test)                          | Banco em memória para o perfil de testes                  |
| `lombok`                             | Redução de boilerplate (getters, builders, construtores)  |

> **Autoconfiguração:** o mecanismo de *starters* do Spring Boot elimina configuração manual de
> `DataSource`, `EntityManagerFactory`, `DispatcherServlet` etc. Basta declarar o starter e prover
> as propriedades de conexão · o Spring Boot autoconfigura o resto via `@EnableAutoConfiguration`.

---

## 3. Configuração do application.properties (Exercício 2)

```properties
spring.application.name=hospital

server.port=8090
server.address=127.0.0.1

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/hospitaldb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=hospital_user
spring.datasource.password=hospital_pass

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Spring Boot Actuator
management.endpoints.access.default=unrestricted
management.endpoint.health.access=unrestricted
management.endpoint.health.show-details=always
```

### Decisões de configuração

- **`ddl-auto=update`** · conforme exigido pelo enunciado: cria/atualiza as tabelas
  automaticamente a partir das entidades, preservando dados entre reinícios.
- **Porta 8090** · as portas 8080 e 8087 já são utilizadas por outros serviços no ambiente
  de desenvolvimento; 8090 está livre.
- **`server.address=127.0.0.1`** · restringe o bind ao loopback em execução local (nenhum
  dispositivo externo acessa). Em Docker, o `docker-compose.yml` sobrescreve para `0.0.0.0`
  (necessário para o mapeamento de porta do container; o isolamento de rede do Docker fornece
  a segurança).
- **Actuator** · Spring Boot 4.x usa o modelo de **acesso por endpoint**
  (`management.endpoint.health.access`); a antiga `management.endpoints.web.exposure.include`
  foi removida.

---

## 4. Entidade Paciente (Exercício 3)

```java
@Entity
@Table(name = "pacientes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paciente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nome;
    @Column(nullable = false, unique = true, length = 11) private String cpf;
    @Column(name = "data_nascimento") private LocalDate dataNascimento;
    private String telefone;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default private List<Consulta> consultas = new ArrayList<>();
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default private List<Internacao> internacoes = new ArrayList<>();
}
```

Atende ao enunciado (id, nome, CPF, dataNascimento, telefone). O `cpf` é `unique` (regra de
domínio: não há dois pacientes com o mesmo CPF). As coleções usam `FetchType.LAZY` para evitar
o problema N+1, e `@Builder.Default` garante inicialização como `ArrayList` vazia em vez de `null`.

Repositório: `PacienteRepository extends JpaRepository<Paciente, Long>`.

---

## 5. Entidade Medico (Exercício 4)

```java
@Entity @Table(name = "medicos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Medico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String nome;
    @Column(nullable = false, unique = true) private String crm;
    @Column(nullable = false) private String especialidade;

    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default private List<Consulta> consultas = new ArrayList<>();
}
```

Atende ao enunciado (id, nome, CRM, especialidade). O `crm` é `unique`.
Repositório: `MedicoRepository extends JpaRepository<Medico, Long>` (com query JPQL · seção 10).

---

## 6. Entidade Consulta e Relacionamentos (Exercício 5)

```java
@Entity @Table(name = "consultas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Consulta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "data_consulta", nullable = false) private LocalDateTime dataConsulta;
    @Column(length = 1000) private String observacoes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paciente_id", nullable = false) private Paciente paciente;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medico_id", nullable = false) private Medico medico;
}
```

### Relacionamentos modelados

| Cardinalidade exigida                              | Implementação                                   |
|----------------------------------------------------|-------------------------------------------------|
| Um Paciente pode possuir várias Consultas          | `Paciente.consultas` `@OneToMany(mappedBy)`     |
| Um Médico pode realizar várias Consultas           | `Medico.consultas` `@OneToMany(mappedBy)`       |
| Cada Consulta pertence a um Paciente e um Médico    | `Consulta` `@ManyToOne` para ambos (NOT NULL)   |

O lado *proprietário* do relacionamento é `Consulta` (contém as foreign keys `paciente_id` e
`medico_id`). Os `@ManyToOne` usam `FetchType.EAGER` porque o `ConsultaResponseDTO` precisa do
nome do paciente e do médico · evita `LazyInitializationException`.

---

## 7. Entidade Internacao (Exercício 6)

```java
@Entity @Table(name = "internacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Internacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "data_entrada", nullable = false) private LocalDate dataEntrada;
    @Column(name = "data_alta") private LocalDate dataAlta;
    @Column(nullable = false) private String quarto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paciente_id", nullable = false) private Paciente paciente;
}
```

Atende ao enunciado (id, dataEntrada, dataAlta, quarto) e ao relacionamento "um Paciente pode
possuir várias Internações" (`@ManyToOne` em `Internacao` + `@OneToMany` em `Paciente`).
`dataAlta` é nullable · um paciente internado ainda não recebeu alta.

---

## 8. Dados Iniciais com CommandLineRunner (Exercício 7)

```java
@Component @RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;

    @Override public void run(String... args) {
        if (medicoRepository.count() == 0) {
            medicoRepository.save(Medico.builder()
                .nome("Dr. Carlos Menezes").crm("CRM-12345/SP")
                .especialidade("Cardiologista").build());
            medicoRepository.save(Medico.builder()
                .nome("Dra. Ana Ferreira").crm("CRM-67890/RJ")
                .especialidade("Ortopedista").build());
        }
        if (pacienteRepository.count() == 0) {
            pacienteRepository.save(Paciente.builder()
                .nome("João Silva").cpf("12345678901")
                .dataNascimento(LocalDate.of(1985, 3, 20))
                .telefone("(11) 91234-5678").build());
            pacienteRepository.save(Paciente.builder()
                .nome("Maria Oliveira").cpf("98765432100")
                .dataNascimento(LocalDate.of(1992, 7, 15))
                .telefone("(21) 98765-4321").build());
        }
    }
}
```

Atende ao enunciado, que exige **2 médicos** (Cardiologista, Ortopedista) e **2 pacientes**
(João Silva, Maria Oliveira). Para fins de demonstração da plataforma, o seed foi **ampliado**
mantendo os obrigatórios e acrescentando outros: ao todo **12 médicos** (12 especialidades),
**8 pacientes**, **28 consultas** e **4 internações**, o que popula o ranking JPQL Top 10, as
listagens e as estatísticas com dados realistas.

> Endpoints de leitura adicionais: além do exigido, foram expostos `GET /consultas` e
> `GET /internacoes` (perfis USER/ADMIN) para o frontend listar os registros.

### Decisão: CommandLineRunner vs data.sql + guarda `count() == 0`

Optou-se por `CommandLineRunner` (sobre `data.sql`) por usar a API tipada do repositório e o
Builder do Lombok · mais legível e refatorável. A guarda `if (count() == 0)` torna a operação
**idempotente**: com `ddl-auto=update` as tabelas persistem entre reinícios, então a guarda evita
violação de constraint `unique` (CPF/CRM duplicados) em execuções subsequentes.

---

## 9. Camadas Service e Controller (Exercício 8)

### Separação de responsabilidades

O **Controller** apenas orquestra (recebe HTTP, delega, empacota `ResponseEntity` com o status
correto). O **Service** concentra a lógica de negócio e a conversão entidade↔DTO. Exemplo:

```java
@RestController @RequestMapping("/pacientes") @RequiredArgsConstructor
public class PacienteController {
    private final PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> cadastrar(@Valid @RequestBody PacienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.cadastrar(dto));
    }
    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }
    @GetMapping
    public ResponseEntity<List<PacienteResponseDTO>> listar() {
        return ResponseEntity.ok(pacienteService.listar());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        pacienteService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
```

```java
public void remover(Long id) {
    if (!pacienteRepository.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Paciente com id " + id + " não encontrado");
    }
    pacienteRepository.deleteById(id);
}
```

### Endpoints implementados

| Entidade  | Endpoints                                                               |
|-----------|-------------------------------------------------------------------------|
| Paciente  | POST `/pacientes` · GET `/pacientes/{id}` · GET `/pacientes` · DELETE `/pacientes/{id}` |
| Médico    | POST `/medicos` · GET `/medicos` (+ GET `/medicos/ranking`)             |
| Consulta  | POST `/consultas`                                                       |
| Internação| POST `/internacoes` (extra, para a entidade do Exercício 6)            |

### Códigos de status HTTP (idiomáticos)

`201 Created` (POST) · `200 OK` (GET) · `204 No Content` (DELETE) · `404 Not Found` (recurso
inexistente) · `400 Bad Request` (validação). O DTO desacopla o contrato HTTP do modelo interno:
Request DTOs nunca contêm `id` (o servidor define a identidade); Response DTOs nunca expõem
entidades JPA com relacionamentos lazy.

---

## 10. Consulta Personalizada · Ranking de Médicos (Exercício 9)

Query JPQL com `COUNT`, `GROUP BY` e `ORDER BY DESC`, projetada diretamente para um DTO via
*constructor expression*:

```java
@Query("SELECT new com.hospital.dtos.MedicoRankingDTO(m.id, m.nome, m.crm, m.especialidade, COUNT(c)) " +
       "FROM Consulta c JOIN c.medico m " +
       "GROUP BY m.id, m.nome, m.crm, m.especialidade " +
       "ORDER BY COUNT(c) DESC")
List<MedicoRankingDTO> findMedicosComMaisConsultas();
```

Retorna os médicos ordenados do **maior para o menor** número de consultas realizadas, exatamente
como pedido. A *constructor expression* evita mapeamento intermediário (`Object[]`), entregando
objetos tipados prontos para o JSON. Exposto em `GET /medicos/ranking`.

**Evidência real** (após 3 consultas: 2 para o médico 1, 1 para o médico 2):

```json
[
  {"id":1,"nome":"Dr. Carlos Menezes","crm":"CRM-12345/SP","especialidade":"Cardiologista","totalConsultas":2},
  {"id":2,"nome":"Dra. Ana Ferreira","crm":"CRM-67890/RJ","especialidade":"Ortopedista","totalConsultas":1}
]
```

---

## 11. Testes Unitários (Exercício 10)

Com **JUnit 5 + Mockito**, os repositórios são simulados (`@Mock`) e injetados no service
(`@InjectMocks`) · testando a lógica de negócio **isoladamente**, sem Spring context nem banco.

### PacienteServiceTest (6 casos)

| Teste                                            | Verifica                                  |
|--------------------------------------------------|-------------------------------------------|
| `cadastrar_deveSalvarERetornarResponseDTO`       | cadastro de paciente                      |
| `buscarPorId_deveRetornarPacienteExistente`      | busca por ID (sucesso)                    |
| `buscarPorId_deveLancarExcecaoQuandoPacienteNaoExiste` | comportamento quando paciente não existe |
| `listar_deveRetornarListaDePacientes`            | listagem                                  |
| `remover_deveDeletarPacienteExistente`           | exclusão de paciente                      |
| `remover_deveLancarExcecaoQuandoPacienteNaoExiste` | exclusão de paciente inexistente (404)  |

### MedicoServiceTest (3 casos)

`cadastrar_deveSalvarERetornarResponseDTO` · `listar_deveRetornarListaDeMedicos` ·
`listar_deveRetornarListaVaziaQuandoNaoHaMedicos`.

Exemplo (validação do comportamento quando o paciente não existe):

```java
@Test
void buscarPorId_deveLancarExcecaoQuandoPacienteNaoExiste() {
    when(pacienteRepository.findById(99L)).thenReturn(Optional.empty());
    assertThatThrownBy(() -> pacienteService.buscarPorId(99L))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("não encontrado");
}
```

Cobre os 5 cenários exigidos pelo enunciado: cadastro de paciente, cadastro de médico,
busca por ID, exclusão de paciente e comportamento quando o paciente não existe.

---

## 12. Testes de Integração (Exercício 11)

Com **`@SpringBootTest` + `@AutoConfigureMockMvc` + MockMvc**, no perfil `test` (H2 em memória
via `application-test.properties`). Os testes validam **status HTTP**, **estrutura JSON** e
**persistência real** no banco de testes.

```java
@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PacienteControllerTest { ... }
```

| # | Teste                                  | Valida                                          |
|---|----------------------------------------|-------------------------------------------------|
| 1 | Cadastrar paciente via API             | `201 Created`, JSON com `id`/`nome`/`cpf`       |
| 2 | Buscar o paciente cadastrado           | `200 OK`, JSON correto                          |
| 3 | Listar todos os pacientes              | `200 OK`, array não vazio                       |
| 4 | Excluir um paciente                    | `204 No Content`                                |
| 5 | Acesso sem autenticação                | `401 Unauthorized` (segurança)                  |
| 6 | USER tentando POST                     | `403 Forbidden` (autorização por perfil)        |

Exemplo (cadastro + validação de status e JSON):

```java
mockMvc.perform(post("/pacientes")
        .with(httpBasic("admin", "admin123"))
        .contentType(MediaType.APPLICATION_JSON).content(corpo))
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.id").exists())
    .andExpect(jsonPath("$.nome").value("Ana Teste"))
    .andExpect(jsonPath("$.cpf").value("11122233344"));
```

> **Nota técnica (Spring Boot 4):** o suporte a MockMvc foi modularizado · exige a dependência
> `spring-boot-webmvc-test`, e `@AutoConfigureMockMvc` migrou para o pacote
> `org.springframework.boot.webmvc.test.autoconfigure`. O `ObjectMapper` agora é Jackson 3
> (`tools.jackson.databind.ObjectMapper`).

---

## 13. Deploy com Docker (Exercício 12)

### Dockerfile (multi-stage build)

```dockerfile
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
ARG MAVEN_VERSION=3.9.16
RUN apt-get update -q && apt-get install -y -q wget && \
    wget -q "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/apache-maven-${MAVEN_VERSION}-bin.tar.gz" && \
    tar -xzf "apache-maven-${MAVEN_VERSION}-bin.tar.gz" -C /opt && \
    ln -s "/opt/apache-maven-${MAVEN_VERSION}/bin/mvn" /usr/local/bin/mvn && \
    rm "apache-maven-${MAVEN_VERSION}-bin.tar.gz" && \
    apt-get remove -y wget && rm -rf /var/lib/apt/lists/*
COPY pom.xml ./
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/hospital-1.0.0.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
```

O *multi-stage build* compila num estágio com JDK + Maven e copia apenas o JAR para uma imagem
final enxuta (apenas JRE). O Maven é baixado do **Maven Central** (`repo.maven.apache.org`), que
mantém todas as versões permanentemente · `downloads.apache.org` só guarda a versão atual.

### docker-compose.yml (orquestração)

```yaml
services:
  postgres:
    image: postgres:18.4-alpine
    environment:
      POSTGRES_DB: hospitaldb
      POSTGRES_USER: hospital_user
      POSTGRES_PASSWORD: hospital_pass
    ports: ["5432:5432"]
    volumes: ["hospital_data:/var/lib/postgresql"]   # PostgreSQL 18+ usa subdir versionado
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hospital_user -d hospitaldb"]
      interval: 10s
      timeout: 5s
      retries: 5
  app:
    build: .
    ports: ["8090:8090"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/hospitaldb
      SPRING_DATASOURCE_USERNAME: hospital_user
      SPRING_DATASOURCE_PASSWORD: hospital_pass
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SERVER_ADDRESS: 0.0.0.0
    depends_on:
      postgres:
        condition: service_healthy
volumes:
  hospital_data:
```

Define **dois serviços** (app + PostgreSQL), **rede** própria (default do Compose), **volume**
nomeado (`hospital_data`) para persistência, **healthcheck** no PostgreSQL e `depends_on` com
`condition: service_healthy` · a aplicação só inicia após o banco estar pronto. Sobe com um único
comando: `docker compose up --build`.

---

## 14. Segurança com Spring Security

Embora não exigida pelo enunciado dos exercícios, a **rúbrica 5** demanda Spring Security.
A configuração usa **HTTP Basic** com dois usuários em memória e senhas com **BCrypt**:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/actuator/health").permitAll()
            .requestMatchers(HttpMethod.GET, "/pacientes/**", "/medicos/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers(HttpMethod.POST, "/pacientes", "/medicos", "/consultas", "/internacoes").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/pacientes/**").hasRole("ADMIN")
            .anyRequest().authenticated())
        .httpBasic(Customizer.withDefaults());
    return http.build();
}
```

| Usuário | Senha    | Role  | Permissões                    |
|---------|----------|-------|-------------------------------|
| admin   | admin123 | ADMIN | leitura + escrita + exclusão  |
| user    | user123  | USER  | apenas leitura (GET)          |

**Decisões de segurança documentadas:**
- `/actuator/health` é público (permitAll) · necessário para o healthcheck do Docker.
- CSRF desabilitado: a API é stateless (sem sessão/cookies), autenticada por header Basic a cada
  requisição; proteção CSRF é irrelevante nesse modelo.
- **CORS** habilitado apenas para a origem do frontend (`http://localhost:5173`), com `OPTIONS`
  liberado para o preflight · permite o React consumir a API sem expor a origem a terceiros.
- Tentativas sem autenticação → `401`; autenticado sem permissão → `403` (comprovado em teste).
- A autoconfiguração de segurança do Spring Boot foi personalizada de forma mínima e consciente ·
  apenas o necessário para o modelo de papéis, mantendo os padrões seguros.

---

## 15. Princípios de Qualidade Aplicados

**SOLID** · SRP (cada classe com uma responsabilidade: controller≠service≠repository≠DTO);
OCP (adicionar entidade = novas classes, sem alterar existentes); LSP/DIP (services dependem das
interfaces `JpaRepository`, nunca de implementações); ISP (repositórios expõem só o contrato
necessário).

**DRY** · `toResponseDTO(Entidade)` é o único ponto de conversão entidade→DTO em cada service.

**YAGNI / anti-overengineering** · sem camadas `mapper`/`facade` desnecessárias; `ResponseStatusException`
nativa em vez de hierarquia de exceções; `boolean`/tipos simples em vez de abstrações especulativas.

**DDD** · linguagem ubíqua em português; separação por domínio nos pacotes (`models`,
`repositories`, `services`, `controllers`, `dtos`, `config`, `exception`).

**Design Patterns** · Builder (Lombok), Repository (Spring Data), Factory Method implícito
(Spring IoC), Command (`CommandLineRunner`), DTO.

**Segurança (OWASP)** · A01/A07 (Spring Security, BCrypt, controle por perfil); A03 (JPQL
parametrizado, sem concatenação SQL); A05 (Actuator restrito ao health, sem stack trace no corpo
de erro · o `GlobalExceptionHandler` serializa apenas status + mensagem).

---

## 16. Evidências de Execução

### 16.1 Testes automatizados (`mvn test`)

```
Tests run: 6, Failures: 0, Errors: 0 -- PacienteControllerTest   (integração MockMvc)
Tests run: 1, Failures: 0, Errors: 0 -- HospitalApplicationTests (contextLoads)
Tests run: 3, Failures: 0, Errors: 0 -- MedicoServiceTest        (unitário Mockito)
Tests run: 6, Failures: 0, Errors: 0 -- PacienteServiceTest      (unitário Mockito)
Tests run: 16, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### 16.2 Build do artefato (`mvn package`)

```
Building jar: target/hospital-1.0.0.jar   (~62 MB, executável via java -jar)
BUILD SUCCESS
```

### 16.3 Stack Docker (`docker compose up --build`)

```
Container hospital-postgres  ... Healthy
Container hospital-app       ... Started
App UP após ~8s
```

### 16.4 Health check (`GET /actuator/health`)

```json
{"status":"UP","components":{"db":{"status":"UP","details":{"database":"PostgreSQL"}},
 "diskSpace":{"status":"UP"},"livenessState":{"status":"UP"},"readinessState":{"status":"UP"}}}
```

### 16.5 Bateria de validação da API (contra o container, porta 8090)

| # | Cenário | Método | Esperado | Obtido |
|---|---------|--------|----------|--------|
| 1 | `/actuator/health` | ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | ✅ |
| 2 | `/pacientes` sem autenticação | ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | ![401](https://img.shields.io/badge/401-ea580c?style=flat-square) | ✅ |
| 3 | `/pacientes` com user | ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | ![200](https://img.shields.io/badge/200-16a34a?style=flat-square) | ✅ |
| 4 | `/medicos` com user (sem permissão) | ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | ![403](https://img.shields.io/badge/403-ea580c?style=flat-square) | ✅ |
| 5 | `/pacientes` com admin | ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) | ✅ |
| 6 | `/consultas` (×3) | ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) | ✅ |
| 7 | `/internacoes` | ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | ![201](https://img.shields.io/badge/201-16a34a?style=flat-square) | ✅ |
| 8 | `/pacientes/999` (inexistente) | ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | ![404](https://img.shields.io/badge/404-dc2626?style=flat-square) | ✅ |
| 9 | `/pacientes` com campos vazios | ![POST](https://img.shields.io/badge/POST-16a34a?style=flat-square) | ![400](https://img.shields.io/badge/400-d97706?style=flat-square) | ✅ |
| 10| `/medicos/ranking` (JPQL) | ![GET](https://img.shields.io/badge/GET-2563eb?style=flat-square) | ![ordenado](https://img.shields.io/badge/ordenado-2%E2%86%921-16a34a?style=flat-square) | ✅ |

**Exemplo · erro 404 (JSON estruturado pelo `GlobalExceptionHandler`):**
```json
{"erro":"Paciente com id 999 não encontrado","timestamp":"2026-06-24T02:21:06.25","status":404}
```

**Exemplo · erro 400 (Bean Validation):**
```json
{"erro":"Dados inválidos","status":400,
 "campos":{"cpf":"CPF é obrigatório","nome":"Nome é obrigatório",
           "dataNascimento":"Data de nascimento é obrigatória"}}
```

---

## 17. Cobertura das Rúbricas

| # | Rúbrica | Status | Evidência neste projeto |
|---|---------|--------|-------------------------|
| 1 | Criar app web a partir do Spring Initializer | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | Maven + Java 25 justificados; todas as dependências obrigatórias; `ddl-auto=update`; `/actuator/health` exposto e validado (UP) |
| 2 | RESTful APIs com Spring Boot | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | Endpoints completos com `@GetMapping`/`@PostMapping`/`@DeleteMapping`; `@RestControllerAdvice`; DTOs; status 201/200/204/404/400; Controller≠Service; `@OneToMany`/`@ManyToOne`; `CommandLineRunner` |
| 3 | Persistência com JPA | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | PostgreSQL via Spring Data JPA; `@Entity`/`@Id`/`@GeneratedValue`; `JpaRepository`; JPQL ranking ordenado; `CommandLineRunner`; Actuator |
| 4 | Testes em Spring Boot | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | `@SpringBootTest` + perfil de teste (H2); 9 testes unitários (Mockito); 6 de integração (MockMvc, valida status/JSON/persistência); **16/16 passando** |
| 5 | Segurança em Spring Boot | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | Spring Security HTTP Basic; roles ADMIN/USER; BCrypt; CORS para o frontend; Actuator health protegido por permitAll consciente; **401/403 comprovados por teste**; decisões documentadas |
| 6 | Deploy em Spring Boot | ![ok](https://img.shields.io/badge/atendida-16a34a?style=flat-square) | JAR executável (`java -jar`); health checks + testes antes do deploy; Dockerfile multi-stage funcional; `docker compose up` com app + PostgreSQL, rede e volume · **ambiente completo validado** |

---

**Conclusão:** todos os 12 exercícios e as 6 rúbricas foram implementados e **validados em
execução real** · testes automatizados (16/16), build do JAR, e o stack Docker completo
(aplicação + PostgreSQL) respondendo na porta 8090 com fluxo end-to-end comprovado.

---

## Créditos de mídia

Todas as mídias são de uso gratuito sob as respectivas licenças (Unsplash, Pexels, Pixabay,
Vecteezy, Videezy), com atribuição.

**Imagens (Unsplash):**
- Fundo da página: [Ricardo Gomez Angel](https://unsplash.com/pt-br/fotografias/pessoas-andando-em-edificio-de-concreto-branco-durante-o-dia-cq4UJnEhh54) (Kilchberg, Suíça)
- Seção "Saúde na palma da mão": [nappy](https://unsplash.com/pt-br/fotografias/uma-pessoa-segurando-um-telefone-1Y7ynoLFFDY)

**Vídeos** (otimizados para web, em `frontend/public/videos/`):
- Hero: [Pixabay 152798](https://pixabay.com/videos/couple-lovers-hands-love-street-152798/), [cottonbro · Pexels 7224949](https://www.pexels.com/pt-br/video/adultos-vista-traseira-brilhante-luminoso-7224949/), [Vecteezy 27950720](https://www.vecteezy.com/video/27950720-doctor-male-checks-blood-pressure-with-blood-pressure-and-heart-rate-monitor-with-a-digital-pressure-gauge-in-the-hospital-cardiology-medical-equipment-and-healthcare-awareness-concept), [Vecteezy 23860396](https://www.vecteezy.com/video/23860396-men-s-health-exam-with-doctor-or-psychiatrist-working-with-patient-having-consultation-on-diagnostic-examination-on-male-disease-or-mental-illness-in-medical-clinic-or-hospital-mental-health-service)
- Ações do hospital: [Vecteezy 42648365](https://www.vecteezy.com/video/42648365-doctor-working-with-patient-in-hospital-closeup-rehabilitation-physiotherapy)
- Exames: [Pixabay 206173](https://pixabay.com/videos/brain-mind-knowledge-think-206173/) (neuro), [Videezy](https://www.videezy.com/abstract/56587-3d-animation-graphic-of-human-dna-on-computer-screen) (DNA), [Pixabay 57691](https://pixabay.com/videos/blood-vessels-human-body-vein-57691/) (cardio), [Tima Miroshnichenko · Pexels 9573756](https://www.pexels.com/pt-br/video/rotacao-sangue-quimica-close-9573756/) (laboratório)

**Ícones:** [Tabler Icons](https://tabler.io/icons) (MIT). &nbsp; **Badges:** [Shields.io](https://shields.io/).
