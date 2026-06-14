package com.gastos.gastos_backend.controller;

import com.gastos.gastos_backend.entity.Gasto;
import com.gastos.gastos_backend.service.GastoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class GastoController {

    private final GastoService service;

    // GET /api/gastos
    @GetMapping
    public List<Gasto> listar() {
        return service.listar();
    }

    // GET /api/gastos/{id}
    @GetMapping("/{id}")
    public Gasto buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // POST /api/gastos
    @PostMapping
    public Gasto guardar(@RequestBody Gasto gasto) {
        return service.guardar(gasto);
    }

    // PUT /api/gastos/{id}
    @PutMapping("/{id}")
    public Gasto actualizar(@PathVariable Long id,
                            @RequestBody Gasto gasto) {
        return service.actualizar(id, gasto);
    }

    // DELETE /api/gastos/{id}
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    // GET /api/gastos/filtrar?categoriaId=1
    @GetMapping("/filtrar")
    public List<Gasto> filtrarPorCategoria(
            @RequestParam Long categoriaId) {

        return service.filtrarPorCategoria(categoriaId);
    }

    // GET /api/gastos/total
    @GetMapping("/total")
    public BigDecimal obtenerTotal() {
        return service.obtenerTotal();
    }

    


}
