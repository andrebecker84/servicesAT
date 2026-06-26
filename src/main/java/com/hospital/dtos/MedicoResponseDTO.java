package com.hospital.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoResponseDTO {

    private Long id;
    private String nome;
    private String crm;
    private String especialidade;
}
