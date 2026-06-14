import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  obtenerGastos,
  actualizarGasto,
  eliminarGasto as eliminarGastoService,
  crearGasto,
  filtrarPorCategoria,
} from "./services/gastoService";
import { obtenerCategorias } from "./services/categoriaService";
import Categorias from "./pages/Categorias";
import Reportes from "./pages/Reportes";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  cutout: "60%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

/* ── Toast helper ── */
function Toast({ mensaje, tipo = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`toast ${tipo === "error" ? "error" : ""}`}>{mensaje}</div>;
}

/* ── Modal de Editar / Nuevo Gasto ── */
function GastoModal({ gasto, categorias, onGuardar, onCerrar, titulo, labelBoton }) {
  const [form, setForm] = useState({
    descripcion: gasto?.descripcion ?? "",
    categoriaId: gasto?.categoria?.id ?? "",
    monto: gasto?.monto ?? "",
    fecha: gasto?.fecha ?? "",
  });

  const valido =
    form.descripcion.trim() !== "" &&
    form.categoriaId !== "" &&
    form.monto !== "" &&
    form.fecha !== "";

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{titulo}</span>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              placeholder="Ej: Almuerzo, Luz, Netflix..."
              value={form.descripcion}
              onChange={handle}
            />
          </div>

          <div className="field-group">
            <label>Categoría</label>
            <select name="categoriaId" value={form.categoriaId} onChange={handle}>
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Monto (S/.)</label>
            <input
              type="number"
              name="monto"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.monto}
              onChange={handle}
            />
          </div>

          <div className="field-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handle}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCerrar}>Cancelar</button>
          <button
            className="btn-save"
            disabled={!valido}
            onClick={() => valido && onGuardar(form)}
          >
            {labelBoton}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   APP PRINCIPAL
══════════════════════════════ */
function App() {
  const [page, setPage] = useState("gastos");
  const [gastos, setGastos] = useState([]);

  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Alimentación", color: "#1A5C2A" },
    { id: 2, nombre: "Transporte", color: "#185FA5" },
    { id: 3, nombre: "Salud", color: "#C0392B" },
    { id: 4, nombre: "Entretenimiento", color: "#F39C12" },
    { id: 5, nombre: "Educación", color: "#8E44AD" }
  ]);

  /* búsqueda y filtro */
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  /* modales */
  const [modalEditar, setModalEditar] = useState(null);   // gasto a editar
  const [modalNuevo, setModalNuevo]   = useState(false);

  /* toast */
  const [toast, setToast] = useState(null);               // { msg, tipo }

  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
  };

  /* ── Cargar datos ── */
  const cargarGastos = useCallback(async () => {
    try {
      const res = await obtenerGastos();
      setGastos(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cargarCategorias = useCallback(async () => {
    try {
      const res = await obtenerCategorias();
      setCategorias(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    cargarGastos();
    cargarCategorias();
  }, [cargarGastos, cargarCategorias]);

  /* ── Filtrar por categoría (select) ── */
  const handleFiltroCategoria = async (e) => {
    const id = e.target.value;
    setCategoriaFiltro(id);
    try {
      if (id === "") {
        await cargarGastos();
      } else {
        const res = await filtrarPorCategoria(id);
        setGastos(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Gastos filtrados por búsqueda de texto ── */
  const gastosFiltrados = gastos.filter((g) =>
    g.descripcion?.toLowerCase().includes(textoBusqueda.toLowerCase())
  );

  /* ── Chart dinámico ── */
  const colores = ["#1a5c2a", "#185fa5", "#4a1a8c", "#ef9f27", "#c0392b", "#16a085"];
  const totalPorCat = categorias.map((cat, i) => ({
    nombre: cat.nombre,
    color: cat.color || colores[i % colores.length],
    total: gastos
      .filter((g) => g.categoria?.id === cat.id)
      .reduce((s, g) => s + Number(g.monto), 0),
  }));
  const totalGeneral = totalPorCat.reduce((s, c) => s + c.total, 0);
  const chartData = {
    labels: totalPorCat.map((c) => c.nombre),
    datasets: [{
      data: totalPorCat.map((c) => c.total || 0.001),
      backgroundColor: totalPorCat.map((c) => c.color),
      borderWidth: 0,
    }],
  };

  /* ── GUARDAR EDICIÓN ── */
  const guardarEdicion = async (form) => {
    try {
      await actualizarGasto(modalEditar.id, {
        descripcion: form.descripcion,
        monto: Number(form.monto),
        fecha: form.fecha,
        categoria: {
          id: Number(form.categoriaId)
        }
      });

      setGastos((prev) =>
          prev.map((g) => {
            if (g.id !== modalEditar.id) return g;

            return {
              ...g,
              descripcion: form.descripcion,
              monto: Number(form.monto),
              fecha: form.fecha,
              categoria: categorias.find(
                  (c) => c.id === Number(form.categoriaId)
              ) || g.categoria
            };
          })
      );

      setModalEditar(null);
      mostrarToast("✓ Editado correctamente");
    } catch (e) {
      console.error(e);
      mostrarToast("Error al editar", "error");
    }
  };

  /* ── ELIMINAR ── */
  const handleEliminar = async (id) => {
    try {
      await eliminarGastoService(id);
      await cargarGastos();
      mostrarToast("✓ Eliminado correctamente");
    } catch (e) {
      console.error(e);
      mostrarToast("Error al eliminar", "error");
    }
  };

  /* ── CREAR NUEVO ── */
  const guardarNuevo = async (form) => {
    try {
      await crearGasto({
        descripcion: form.descripcion,
        monto: form.monto,
        fecha: form.fecha,
        categoria: {
          id: Number(form.categoriaId)
        }
      });

      setModalNuevo(false);
      await cargarGastos();
      mostrarToast("✓ Gasto agregado correctamente");
    } catch (e) {
      console.error(e);
      mostrarToast("Error al agregar", "error");
    }
  };

  return (
    <div className="app-container">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-title">Gastos</div>
        <nav>
          {["gastos", "categorias", "reportes"].map((p) => (
            <div
              key={p}
              className={`sb-item ${page === p ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">

        {/* ═══════════ GASTOS ═══════════ */}
        {page === "gastos" && (
          <>
            <div className="topbar">
              <span className="topbar-title">Gastos</span>
              <button className="btn-nuevo" onClick={() => setModalNuevo(true)}>
                + Nuevo Gasto
              </button>
            </div>

            <div className="toolbar">
              {/* BUSCADOR — borde negro al hacer foco (ver .search:focus en CSS) */}
              <input
                className="search"
                placeholder="Buscar gasto..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              <select className="sel" value={categoriaFiltro} onChange={handleFiltroCategoria}>
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="content">
              <div className="grid2">

                {/* Tabla */}
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th className="th-id">ID</th>
                        <th>Descripción</th>
                        <th className="th-cat">Categoría</th>
                        <th className="th-monto">Monto</th>
                        <th className="th-fecha">Fecha</th>
                        <th className="th-acc">Acc.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosFiltrados.map((gasto) => (
                        <tr key={gasto.id}>
                          <td>{gasto.id}</td>
                          <td>{gasto.descripcion}</td>
                          <td>
                            <span
                              className="pill"
                              style={{
                                backgroundColor: `${gasto.categoria?.color}20`,
                                color: gasto.categoria?.color,
                              }}
                            >
                              {gasto.categoria?.nombre}
                            </span>
                          </td>
                          <td className="monto">
                            {JSON.stringify(gasto.monto)}
                          </td>
                          <td>{gasto.fecha?.split("-").reverse().join("-")}</td>
                          <td>
                            <div className="act">
                              <button
                                className="be"
                                title="Editar"
                                onClick={() => setModalEditar(gasto)}
                              >
                                ✏
                              </button>
                              <button
                                className="bd"
                                title="Eliminar"
                                onClick={() => handleEliminar(gasto.id)}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {gastosFiltrados.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center", color: "#aaa", padding: "20px" }}>
                            No hay gastos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Panel derecho */}
                <div>
                  <div className="total-card">
                    <div className="total-label">Total Gastos</div>
                    <div className="total-amount">
                      ${totalGeneral.toFixed(2)}
                    </div>
                  </div>
                  <div className="pie-card">
                    <div className="pie-title">Por categoría</div>
                    <div className="chart-box">
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className="legend">
                      {totalPorCat.map((c) => (
                        <div className="leg-item" key={c.nombre}>
                          <span className="dot" style={{ background: c.color }} />
                          {c.nombre} ${c.total.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ═══════════ CATEGORÍAS ═══════════ */}
        {page === "categorias" && <Categorias />}

        {/* ═══════════ REPORTES ═══════════ */}
        {page === "reportes" && <Reportes />}

      </div>

      {/* ── MODAL EDITAR ── */}
      {modalEditar && (
        <GastoModal
          gasto={modalEditar}
          categorias={categorias}
          titulo="Editar Gasto"
          labelBoton="Guardar cambios"
          onGuardar={guardarEdicion}
          onCerrar={() => setModalEditar(null)}
        />
      )}

      {/* ── MODAL NUEVO ── */}
      {modalNuevo && (
        <GastoModal
          gasto={null}
          categorias={categorias}
          titulo="Nuevo Gasto"
          labelBoton="Agregar"
          onGuardar={guardarNuevo}
          onCerrar={() => setModalNuevo(false)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <Toast
          mensaje={toast.msg}
          tipo={toast.tipo}
          onDone={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default App;
