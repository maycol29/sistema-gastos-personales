package com.gastos.gastos_backend.repository;

import com.gastos.gastos_backend.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gastos.gastos_backend.dto.ReporteCategoriaDTO;
import org.springframework.data.jpa.repository.Query;
import java.util.List;



public interface GastoRepository extends JpaRepository<Gasto, Long> {


    List<Gasto> findByCategoriaId(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);


    @Query("""
           SELECT new com.gastos.gastos_backend.dto.ReporteCategoriaDTO(
               g.categoria.nombre,
               SUM(g.monto)
           )
           FROM Gasto g
           GROUP BY g.categoria.nombre
           """)
    List<ReporteCategoriaDTO> gastosPorCategoria();

}