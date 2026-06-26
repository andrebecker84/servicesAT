package com.hospital.services;

import com.hospital.dtos.MedicoRankingDTO;
import com.hospital.dtos.MedicoRequestDTO;
import com.hospital.dtos.MedicoResponseDTO;
import com.hospital.models.Medico;
import com.hospital.repositories.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoResponseDTO cadastrar(MedicoRequestDTO dto) {
        Medico medico = Medico.builder()
            .nome(dto.getNome())
            .crm(dto.getCrm())
            .especialidade(dto.getEspecialidade())
            .build();
        return toResponseDTO(medicoRepository.save(medico));
    }

    public List<MedicoResponseDTO> listar() {
        return medicoRepository.findAll().stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public List<MedicoRankingDTO> rankingPorConsultas() {
        return medicoRepository.findMedicosComMaisConsultas();
    }

    private MedicoResponseDTO toResponseDTO(Medico medico) {
        return new MedicoResponseDTO(
            medico.getId(),
            medico.getNome(),
            medico.getCrm(),
            medico.getEspecialidade()
        );
    }
}
