package com.gastos.gastos_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ReporteCategoriaDTO {

    private String categoria;
    private BigDecimal total;
}