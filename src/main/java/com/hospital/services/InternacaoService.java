package com.hospital.services;

import com.hospital.dtos.InternacaoRequestDTO;
import com.hospital.dtos.InternacaoResponseDTO;
import com.hospital.models.Internacao;
import com.hospital.models.Paciente;
import com.hospital.repositories.InternacaoRepository;
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
public class InternacaoService {

    private final InternacaoRepository internacaoRepository;
    private final PacienteRepository pacienteRepository;

    public List<InternacaoResponseDTO> listar() {
        return internacaoRepository.findAll(Sort.by(Sort.Direction.DESC, "dataEntrada")).stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public InternacaoResponseDTO cadastrar(InternacaoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Paciente com id " + dto.getPacienteId() + " não encontrado"));

        Internacao internacao = Internacao.builder()
            .dataEntrada(dto.getDataEntrada())
            .dataAlta(dto.getDataAlta())
            .quarto(dto.getQuarto())
            .paciente(paciente)
            .build();

        return toResponseDTO(internacaoRepository.save(internacao));
    }

    private InternacaoResponseDTO toResponseDTO(Internacao internacao) {
        return new InternacaoResponseDTO(
            internacao.getId(),
            internacao.getDataEntrada(),
            internacao.getDataAlta(),
            internacao.getQuarto(),
            internacao.getPaciente().getId(),
            internacao.getPaciente().getNome()
        );
    }
}
