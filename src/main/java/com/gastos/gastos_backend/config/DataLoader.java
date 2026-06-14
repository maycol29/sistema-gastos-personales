package com.gastos.gastos_backend.config;

import com.gastos.gastos_backend.entity.Categoria;
import com.gastos.gastos_backend.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository repository;

    @Override
    public void run(String... args) {

        if (repository.count() == 0) {

            repository.save(new Categoria(null, "Alimentacion", "#4CAF50"));
            repository.save(new Categoria(null, "Servicios", "#2196F3"));
            repository.save(new Categoria(null, "Entretenimiento", "#9C27B0"));
            repository.save(new Categoria(null, "Transporte", "#FF9800"));
        }
    }
}