package com.hospital.service;

import com.hospital.dtos.MedicoRequestDTO;
import com.hospital.dtos.MedicoResponseDTO;
import com.hospital.models.Medico;
import com.hospital.repositories.MedicoRepository;
import com.hospital.services.MedicoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicoServiceTest {

    @Mock
    private MedicoRepository medicoRepository;

    @InjectMocks
    private MedicoService medicoService;

    private Medico medicoStub() {
        return Medico.builder()
            .id(1L)
            .nome("Dr. Carlos Menezes")
            .crm("CRM-12345/SP")
            .especialidade("Cardiologista")
            .build();
    }

    private MedicoRequestDTO requestStub() {
        return new MedicoRequestDTO("Dr. Carlos Menezes", "CRM-12345/SP", "Cardiologista");
    }

    @Test
    void cadastrar_deveSalvarERetornarResponseDTO() {
        when(medicoRepository.save(any(Medico.class))).thenReturn(medicoStub());

        MedicoResponseDTO resultado = medicoService.cadastrar(requestStub());

        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNome()).isEqualTo("Dr. Carlos Menezes");
        assertThat(resultado.getCrm()).isEqualTo("CRM-12345/SP");
        assertThat(resultado.getEspecialidade()).isEqualTo("Cardiologista");
        verify(medicoRepository, times(1)).save(any(Medico.class));
    }

    @Test
    void listar_deveRetornarListaDeMedicos() {
        when(medicoRepository.findAll()).thenReturn(List.of(medicoStub()));

        List<MedicoResponseDTO> resultado = medicoService.listar();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getEspecialidade()).isEqualTo("Cardiologista");
    }

    @Test
    void listar_deveRetornarListaVaziaQuandoNaoHaMedicos() {
        when(medicoRepository.findAll()).thenReturn(List.of());

        List<MedicoResponseDTO> resultado = medicoService.listar();

        assertThat(resultado).isEmpty();
        verify(medicoRepository, times(1)).findAll();
    }
}
