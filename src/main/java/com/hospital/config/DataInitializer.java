package com.hospital.config;

import com.hospital.models.Consulta;
import com.hospital.models.Internacao;
import com.hospital.models.Medico;
import com.hospital.models.Paciente;
import com.hospital.repositories.ConsultaRepository;
import com.hospital.repositories.InternacaoRepository;
import com.hospital.repositories.MedicoRepository;
import com.hospital.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;
    private final InternacaoRepository internacaoRepository;

    @Override
    public void run(String... args) {
        if (medicoRepository.count() > 0) return; // idempotente

        // ── Médicos (exercício 7: Cardiologista + Ortopedista) e mais especialidades ──
        Medico carlos    = medico("Dr. Carlos Menezes",   "CRM-12345/SP", "Cardiologista");
        Medico ana       = medico("Dra. Ana Ferreira",    "CRM-67890/RJ", "Ortopedista");
        Medico beatriz   = medico("Dra. Beatriz Lima",    "CRM-24680/MG", "Pediatra");
        Medico rafael    = medico("Dr. Rafael Souza",     "CRM-13579/SP", "Neurologista");
        Medico patricia  = medico("Dra. Patrícia Gomes",  "CRM-11223/RS", "Dermatologista");
        Medico eduardo   = medico("Dr. Eduardo Castro",   "CRM-44556/PR", "Ginecologista");
        Medico mariana   = medico("Dra. Mariana Rocha",   "CRM-77889/BA", "Oncologista");
        Medico thiago    = medico("Dr. Thiago Almeida",   "CRM-99001/SC", "Psiquiatra");
        Medico luciana   = medico("Dra. Luciana Faria",   "CRM-33210/GO", "Endocrinologista");
        Medico marcos    = medico("Dr. Marcos Vieira",    "CRM-55678/CE", "Urologista");
        Medico camila    = medico("Dra. Camila Torres",   "CRM-88432/PE", "Oftalmologista");
        Medico renato    = medico("Dr. Renato Barbosa",   "CRM-76543/AM", "Reumatologista");

        // ── Pacientes (exercício 7: João Silva + Maria Oliveira) e mais ──
        Paciente joao     = paciente("João Silva",        "12345678901", 1985, 3, 20,  "(11) 91234-5678");
        Paciente maria    = paciente("Maria Oliveira",    "98765432100", 1992, 7, 15,  "(21) 98765-4321");
        Paciente pedro    = paciente("Pedro Santos",      "45678912300", 1978, 11, 2,  "(31) 99876-1122");
        Paciente juliana  = paciente("Juliana Costa",     "32165498700", 1995, 1, 30,  "(41) 98765-3344");
        Paciente lucas    = paciente("Lucas Pereira",     "78912345600", 2001, 6, 18,  "(51) 99654-7788");
        Paciente carla    = paciente("Carla Mendes",      "65432198700", 1969, 9, 9,   "(71) 98321-9900");
        Paciente bruno    = paciente("Bruno Carvalho",    "14725836900", 1988, 4, 25,  "(48) 99112-3344");
        Paciente fernanda = paciente("Fernanda Dias",     "85296374100", 1973, 12, 12, "(85) 98745-6612");

        // ── Consultas (popula o ranking com volumes variados para top 10) ──
        consulta(carlos,   joao,     2026, 6, 10, 9,  "Avaliação cardiológica de rotina");
        consulta(carlos,   maria,    2026, 6, 11, 10, "Acompanhamento de hipertensão");
        consulta(carlos,   pedro,    2026, 6, 12, 8,  "Dor torácica, solicitado ECG");
        consulta(carlos,   carla,    2026, 6, 15, 14, "Pós-operatório cardíaco");
        consulta(carlos,   bruno,    2026, 6, 18, 16, "Check-up anual");
        consulta(carlos,   lucas,    2026, 6, 23, 10, "Arritmia — monitoramento");
        consulta(ana,      lucas,    2026, 6, 9,  11, "Entorse de tornozelo");
        consulta(ana,      juliana,  2026, 6, 13, 15, "Dor lombar crônica");
        consulta(ana,      fernanda, 2026, 6, 17, 9,  "Revisão de fratura");
        consulta(ana,      joao,     2026, 6, 20, 14, "Hérnia de disco");
        consulta(ana,      pedro,    2026, 6, 22, 11, "Joelho — pós-cirúrgico");
        consulta(beatriz,  lucas,    2026, 6, 14, 8,  "Consulta pediátrica");
        consulta(beatriz,  joao,     2026, 6, 16, 13, "Vacinação e orientação");
        consulta(beatriz,  juliana,  2026, 6, 21, 9,  "Febre — avaliação infantil");
        consulta(beatriz,  maria,    2026, 6, 24, 10, "Acompanhamento de crescimento");
        consulta(rafael,   maria,    2026, 6, 12, 17, "Enxaqueca recorrente");
        consulta(rafael,   bruno,    2026, 6, 19, 10, "Avaliação neurológica");
        consulta(rafael,   carla,    2026, 6, 23, 15, "AVC — reabilitação neurológica");
        consulta(patricia, carla,    2026, 6, 20, 11, "Lesão de pele suspeita");
        consulta(patricia, fernanda, 2026, 6, 24, 9,  "Dermatite atópica");
        consulta(eduardo,  fernanda, 2026, 6, 21, 9,  "Consulta ginecológica anual");
        consulta(eduardo,  juliana,  2026, 6, 25, 14, "Ultrassom pélvico");
        consulta(mariana,  pedro,    2026, 6, 22, 14, "Acompanhamento oncológico");
        consulta(thiago,   bruno,    2026, 6, 20, 10, "Ansiedade — avaliação inicial");
        consulta(luciana,  maria,    2026, 6, 18, 9,  "Hipotireoidismo — controle");
        consulta(marcos,   joao,     2026, 6, 19, 11, "Cálculo renal — avaliação");
        consulta(camila,   lucas,    2026, 6, 17, 8,  "Miopia — prescrição de óculos");
        consulta(renato,   carla,    2026, 6, 16, 14, "Artrite — avaliação reumatológica");

        // ── Internações ──
        internacao(joao,     "201-A", 2026, 6, 10, 2026, 6, 14);
        internacao(carla,    "305-B", 2026, 6, 15, null, null, null);
        internacao(pedro,    "102-C", 2026, 6, 18, 2026, 6, 21);
        internacao(fernanda, "410-A", 2026, 6, 20, null, null, null);
    }

    private Medico medico(String nome, String crm, String especialidade) {
        return medicoRepository.save(
            Medico.builder().nome(nome).crm(crm).especialidade(especialidade).build()
        );
    }

    private Paciente paciente(String nome, String cpf, int ano, int mes, int dia, String telefone) {
        return pacienteRepository.save(
            Paciente.builder()
                .nome(nome).cpf(cpf)
                .dataNascimento(LocalDate.of(ano, mes, dia))
                .telefone(telefone)
                .build()
        );
    }

    private void consulta(Medico medico, Paciente paciente, int ano, int mes, int dia, int hora, String obs) {
        consultaRepository.save(
            Consulta.builder()
                .medico(medico)
                .paciente(paciente)
                .dataConsulta(LocalDateTime.of(ano, mes, dia, hora, 0))
                .observacoes(obs)
                .build()
        );
    }

    private void internacao(Paciente paciente, String quarto,
                            int anoE, int mesE, int diaE,
                            Integer anoA, Integer mesA, Integer diaA) {
        LocalDate alta = (anoA != null) ? LocalDate.of(anoA, mesA, diaA) : null;
        internacaoRepository.save(
            Internacao.builder()
                .paciente(paciente)
                .quarto(quarto)
                .dataEntrada(LocalDate.of(anoE, mesE, diaE))
                .dataAlta(alta)
                .build()
        );
    }
}
