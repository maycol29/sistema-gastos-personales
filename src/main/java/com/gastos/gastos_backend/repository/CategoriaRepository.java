package com.gastos.gastos_backend.repository;


import com.gastos.gastos_backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
