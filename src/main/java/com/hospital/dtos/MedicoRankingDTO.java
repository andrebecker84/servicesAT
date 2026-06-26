package com.hospital.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoRankingDTO {

    private Long id;
    private String nome;
    private String crm;
    private String especialidade;
    private Long totalConsultas;
}
