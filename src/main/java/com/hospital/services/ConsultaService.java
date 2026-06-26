package com.hospital.services;

import com.hospital.dtos.ConsultaRequestDTO;
import com.hospital.dtos.ConsultaResponseDTO;
import com.hospital.models.Consulta;
import com.hospital.models.Medico;
import com.hospital.models.Paciente;
import com.hospital.repositories.ConsultaRepository;
import com.hospital.repositories.MedicoRepository;
import com.hospital.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    public List<ConsultaResponseDTO> listar() {
        return consultaRepository.findAll(Sort.by(Sort.Direction.DESC, "dataConsulta")).stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public ConsultaResponseDTO cadastrar(ConsultaRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Paciente com id " + dto.getPacienteId() + " não encontrado"));

        Medico medico = medicoRepository.findById(dto.getMedicoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Médico com id " + dto.getMedicoId() + " não encontrado"));

        Consulta consulta = Consulta.builder()
            .dataConsulta(dto.getDataConsulta())
            .observacoes(dto.getObservacoes())
            .paciente(paciente)
            .medico(medico)
            .build();

        return toResponseDTO(consultaRepository.save(consulta));
    }

    private ConsultaResponseDTO toResponseDTO(Consulta consulta) {
        return new ConsultaResponseDTO(
            consulta.getId(),
            consulta.getDataConsulta(),
            consulta.getObservacoes(),
            consulta.getPaciente().getId(),
            consulta.getPaciente().getNome(),
            consulta.getMedico().getId(),
            consulta.getMedico().getNome(),
            consulta.getMedico().getEspecialidade()
        );
    }
}
