package com.gastos.gastos_backend.service;

import com.gastos.gastos_backend.entity.Categoria;
import com.gastos.gastos_backend.repository.CategoriaRepository;
import com.gastos.gastos_backend.repository.GastoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    private final GastoRepository gastoRepository;

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    public Categoria guardar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria categoria) {

        Categoria existente = buscarPorId(id);

        existente.setNombre(categoria.getNombre());
        existente.setColor(categoria.getColor());

        return repository.save(existente);
    }

    public void eliminar(Long id) {

        if (gastoRepository.existsByCategoriaId(id)) {

            throw new RuntimeException(
                    "No se puede eliminar la categoria porque tiene gastos asociados"
            );
        }

        repository.deleteById(id);
    }

}
