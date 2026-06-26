package com.hospital.service;

import com.hospital.dtos.PacienteRequestDTO;
import com.hospital.dtos.PacienteResponseDTO;
import com.hospital.models.Paciente;
import com.hospital.repositories.PacienteRepository;
import com.hospital.services.PacienteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PacienteServiceTest {

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private PacienteService pacienteService;

    private Paciente pacienteStub() {
        return Paciente.builder()
            .id(1L)
            .nome("João Silva")
            .cpf("12345678901")
            .dataNascimento(LocalDate.of(1985, 3, 20))
            .telefone("(11) 91234-5678")
            .build();
    }

    private PacienteRequestDTO requestStub() {
        return new PacienteRequestDTO(
            "João Silva",
            "12345678901",
            LocalDate.of(1985, 3, 20),
            "(11) 91234-5678"
        );
    }

    @Test
    void cadastrar_deveSalvarERetornarResponseDTO() {
        Paciente salvo = pacienteStub();
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(salvo);

        PacienteResponseDTO resultado = pacienteService.cadastrar(requestStub());

        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNome()).isEqualTo("João Silva");
        assertThat(resultado.getCpf()).isEqualTo("12345678901");
        verify(pacienteRepository, times(1)).save(any(Paciente.class));
    }

    @Test
    void buscarPorId_deveRetornarPacienteExistente() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(pacienteStub()));

        PacienteResponseDTO resultado = pacienteService.buscarPorId(1L);

        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNome()).isEqualTo("João Silva");
    }

    @Test
    void buscarPorId_deveLancarExcecaoQuandoPacienteNaoExiste() {
        when(pacienteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pacienteService.buscarPorId(99L))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("não encontrado");
    }

    @Test
    void listar_deveRetornarListaDePacientes() {
        when(pacienteRepository.findAll()).thenReturn(List.of(pacienteStub()));

        List<PacienteResponseDTO> resultado = pacienteService.listar();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNome()).isEqualTo("João Silva");
    }

    @Test
    void remover_deveDeletarPacienteExistente() {
        when(pacienteRepository.existsById(1L)).thenReturn(true);
        doNothing().when(pacienteRepository).deleteById(1L);

        pacienteService.remover(1L);

        verify(pacienteRepository, times(1)).deleteById(1L);
    }

    @Test
    void remover_deveLancarExcecaoQuandoPacienteNaoExiste() {
        when(pacienteRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> pacienteService.remover(99L))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("não encontrado");

        verify(pacienteRepository, never()).deleteById(any());
    }
}
