package com.gastos.gastos_backend.service;

import com.gastos.gastos_backend.entity.Gasto;
import com.gastos.gastos_backend.repository.GastoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GastoService {

    private final GastoRepository repository;

    // Listar todos
    public List<Gasto> listar() {
        return repository.findAll();
    }

    // Buscar por ID
    public Gasto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));
    }

    // Guardar
    public Gasto guardar(Gasto gasto) {
        return repository.save(gasto);
    }

    // Actualizar
    public Gasto actualizar(Long id, Gasto gasto) {

        Gasto existente = buscarPorId(id);

        existente.setDescripcion(gasto.getDescripcion());
        existente.setMonto(gasto.getMonto());
        existente.setFecha(gasto.getFecha());
        existente.setCategoria(gasto.getCategoria());

        return repository.save(existente);
    }

    // Eliminar
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // Filtrar por categoría
    public List<Gasto> filtrarPorCategoria(Long categoriaId) {
        return repository.findByCategoriaId(categoriaId);
    }

    // Obtener total
    public BigDecimal obtenerTotal() {

        return repository.findAll()
                .stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}