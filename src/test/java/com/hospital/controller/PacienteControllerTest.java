package com.hospital.controller;

import com.hospital.dtos.PacienteRequestDTO;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long pacienteCriadoId;

    private PacienteRequestDTO requestValido() {
        return new PacienteRequestDTO(
            "Ana Teste",
            "11122233344",
            LocalDate.of(1990, 5, 10),
            "(11) 99000-1111"
        );
    }

    @Test
    @Order(1)
    void teste1_cadastrarPaciente_deveRetornar201ComCorpoJSON() throws Exception {
        String corpo = objectMapper.writeValueAsString(requestValido());

        String resposta = mockMvc.perform(post("/pacientes")
                .with(httpBasic("admin", "admin123"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.nome").value("Ana Teste"))
            .andExpect(jsonPath("$.cpf").value("11122233344"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        pacienteCriadoId = objectMapper.readTree(resposta).get("id").asLong();
    }

    @Test
    @Order(2)
    void teste2_buscarPacienteCadastrado_deveRetornar200() throws Exception {
        if (pacienteCriadoId == null) pacienteCriadoId = 1L;

        mockMvc.perform(get("/pacientes/" + pacienteCriadoId)
                .with(httpBasic("user", "user123")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(pacienteCriadoId))
            .andExpect(jsonPath("$.nome").value("Ana Teste"));
    }

    @Test
    @Order(3)
    void teste3_listarTodosPacientes_deveRetornar200ComLista() throws Exception {
        mockMvc.perform(get("/pacientes")
                .with(httpBasic("user", "user123")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").isNotEmpty());
    }

    @Test
    @Order(4)
    void teste4_excluirPaciente_deveRetornar204() throws Exception {
        if (pacienteCriadoId == null) pacienteCriadoId = 1L;

        mockMvc.perform(delete("/pacientes/" + pacienteCriadoId)
                .with(httpBasic("admin", "admin123")))
            .andExpect(status().isNoContent());
    }

    @Test
    @Order(5)
    void teste5_acessoSemAutenticacao_deveRetornar401() throws Exception {
        mockMvc.perform(get("/pacientes"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(6)
    void teste6_userNaoAdminNaoPodeCadastrar_deveRetornar403() throws Exception {
        String corpo = objectMapper.writeValueAsString(requestValido());

        mockMvc.perform(post("/pacientes")
                .with(httpBasic("user", "user123"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo))
            .andExpect(status().isForbidden());
    }
}
