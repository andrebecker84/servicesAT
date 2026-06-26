package com.hospital.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternacaoRequestDTO {

    @NotNull(message = "Data de entrada é obrigatória")
    private LocalDate dataEntrada;

    private LocalDate dataAlta;

    @NotBlank(message = "Quarto é obrigatório")
    private String quarto;

    @NotNull(message = "ID do paciente é obrigatório")
    private Long pacienteId;
}
