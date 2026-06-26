package com.hospital.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternacaoResponseDTO {

    private Long id;
    private LocalDate dataEntrada;
    private LocalDate dataAlta;
    private String quarto;
    private Long pacienteId;
    private String nomePaciente;
}
