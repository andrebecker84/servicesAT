package com.hospital.services;

import com.hospital.dtos.PacienteRequestDTO;
import com.hospital.dtos.PacienteResponseDTO;
import com.hospital.models.Paciente;
import com.hospital.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteResponseDTO cadastrar(PacienteRequestDTO dto) {
        Paciente paciente = Paciente.builder()
            .nome(dto.getNome())
            .cpf(dto.getCpf())
            .dataNascimento(dto.getDataNascimento())
            .telefone(dto.getTelefone())
            .build();
        return toResponseDTO(pacienteRepository.save(paciente));
    }

    public PacienteResponseDTO buscarPorId(Long id) {
        return pacienteRepository.findById(id)
            .map(this::toResponseDTO)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Paciente com id " + id + " não encontrado"));
    }

    public List<PacienteResponseDTO> listar() {
        return pacienteRepository.findAll().stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public void remover(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Paciente com id " + id + " não encontrado");
        }
        pacienteRepository.deleteById(id);
    }

    private PacienteResponseDTO toResponseDTO(Paciente paciente) {
        return new PacienteResponseDTO(
            paciente.getId(),
            paciente.getNome(),
            paciente.getCpf(),
            paciente.getDataNascimento(),
            paciente.getTelefone()
        );
    }
}
