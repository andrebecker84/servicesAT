package com.hospital.controllers;

import com.hospital.dtos.InternacaoRequestDTO;
import com.hospital.dtos.InternacaoResponseDTO;
import com.hospital.services.InternacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internacoes")
@RequiredArgsConstructor
public class InternacaoController {

    private final InternacaoService internacaoService;

    @GetMapping
    public ResponseEntity<List<InternacaoResponseDTO>> listar() {
        return ResponseEntity.ok(internacaoService.listar());
    }

    @PostMapping
    public ResponseEntity<InternacaoResponseDTO> cadastrar(@Valid @RequestBody InternacaoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internacaoService.cadastrar(dto));
    }
}
