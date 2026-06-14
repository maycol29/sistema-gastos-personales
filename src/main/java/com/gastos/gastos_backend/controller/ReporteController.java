package com.gastos.gastos_backend.controller;

import com.gastos.gastos_backend.dto.ReporteCategoriaDTO;
import com.gastos.gastos_backend.repository.GastoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReporteController {

    private final GastoRepository gastoRepository;

    @GetMapping("/gastos-por-categoria")
    public List<ReporteCategoriaDTO> gastosPorCategoria() {
        return gastoRepository.gastosPorCategoria();
    }
}
