package com.gastos.gastos_backend.controller;

import com.gastos.gastos_backend.entity.Categoria;
import com.gastos.gastos_backend.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategoriaController {

    private final CategoriaService service;

    // GET /api/categorias
    @GetMapping
    public List<Categoria> listar() {
        return service.listar();
    }

    // GET /api/categorias/{id}
    @GetMapping("/{id}")
    public Categoria buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // POST /api/categorias
    @PostMapping
    public Categoria guardar(@RequestBody Categoria categoria) {
        return service.guardar(categoria);
    }

    // PUT /api/categorias/{id}
    @PutMapping("/{id}")
    public Categoria actualizar(@PathVariable Long id,
                                @RequestBody Categoria categoria) {
        return service.actualizar(id, categoria);
    }

    // DELETE /api/categorias/{id}
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}