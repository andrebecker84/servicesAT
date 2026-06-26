package com.hospital.controllers;

import com.hospital.dtos.MedicoRankingDTO;
import com.hospital.dtos.MedicoRequestDTO;
import com.hospital.dtos.MedicoResponseDTO;
import com.hospital.services.MedicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService medicoService;

    @PostMapping
    public ResponseEntity<MedicoResponseDTO> cadastrar(@Valid @RequestBody MedicoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicoService.cadastrar(dto));
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponseDTO>> listar() {
        return ResponseEntity.ok(medicoService.listar());
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<MedicoRankingDTO>> rankingPorConsultas() {
        return ResponseEntity.ok(medicoService.rankingPorConsultas());
    }
}
