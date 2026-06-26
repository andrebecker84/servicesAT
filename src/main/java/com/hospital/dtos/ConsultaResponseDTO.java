package com.hospital.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaResponseDTO {

    private Long id;
    private LocalDateTime dataConsulta;
    private String observacoes;
    private Long pacienteId;
    private String nomePaciente;
    private Long medicoId;
    private String nomeMedico;
    private String especialidadeMedico;
}
