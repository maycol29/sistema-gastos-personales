package com.gastos.gastos_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoriaDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}