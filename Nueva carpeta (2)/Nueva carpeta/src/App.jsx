import "./App.css";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  obtenerGastos,
  actualizarGasto,
  eliminarGasto,
  filtrarPorCategoria
} from "./services/gastoService";
import Categorias from "./pages/Categorias";
import Reportes from "./pages/Reportes";


ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  datasets: [{
    data: [50, 30, 15, 8],
    backgroundColor: ["#1a5c2a", "#185fa5", "#4a1a8c", "#ef9f27"],
    borderWidth: 0,
  }],
};
const chartOptions = {
  cutout: "60%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  }
};

function App() {
  const [page, setPage] = useState("gastos");
  const [gastos, setGastos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [gastoEditar, setGastoEditar] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");

  const filtrarCategoria = async (categoriaId) => {

    try {

      if (categoriaId === "") {

        cargarGastos();

        return;
      }

      const response =
          await filtrarPorCategoria(categoriaId);

      setGastos(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const gastosFiltrados = gastos.filter((gasto) =>
      gasto.descripcion
          ?.toLowerCase()
          .includes(textoBusqueda.toLowerCase())
  );

  const editarGasto = (gasto) => {

    setIdEditar(gasto.id);

    setDescripcion(gasto.descripcion);
    setCategoria(gasto.categoria);
    setMonto(gasto.monto);
    setFecha(gasto.fecha);

    setError("");

    setMostrarModal(true);
  };

  const guardarEdicion = async () => {

    const gastoActualizado = {
      descripcion,
      categoria,
      monto,
      fecha
    };

    try {

      await gastoService.actualizar(idEditar, gastoActualizado);

      cargarGastos();

      setMostrarModal(false);

    } catch (error) {

      console.error(error);

    }
  };
  const eliminarGasto = async (id) => {
    if (!window.confirm("¿Eliminar gasto?")) return;

    await gastoService.eliminar(id);

    cargarGastos();
  }

  const cargarGastos = async () => {
    try {

      const response = await obtenerGastos();

      console.log(response.data);

      setGastos(response.data);

    } catch (error) {
      console.error(error);
      }
    };

  const editarCategoria = (cat) => {
    alert("Editar categoría: " + cat.nombre);
  };

  useEffect(() => {
    cargarGastos();
  }, []);


  return (

    <div className="app-container">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-title">Gastos</div>
        <nav>
          <div className={`sb-item ${page === "gastos" ? "active" : ""}`} onClick={() => setPage("gastos")}>
            Gastos
          </div>
          <div className={`sb-item ${page === "categorias" ? "active" : ""}`} onClick={() => setPage("categorias")}>
            Categorías
          </div>
          <div className={`sb-item ${page === "reportes" ? "active" : ""}`} onClick={() => setPage("reportes")}>
            Reportes
          </div>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">

        {/* ========== GASTOS ========== */}
        {page === "gastos" && (
          <>
            <div className="topbar">
              <span className="topbar-title">Gastos</span>
              <button className="btn-nuevo">+ Nuevo Gasto</button>
            </div>

            <div className="toolbar">
              <input
                  className="search"
                  placeholder="Buscar gasto..."
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              <select
                  className="sel"
                  onChange={(e) =>
                      filtrarCategoria(e.target.value)
                  }
              >
                <option value="">
                  Todas
                </option>

                <option value="1">
                  Alimentación
                </option>

                <option value="2">
                  Servicios
                </option>

                <option value="3">
                  Entretenimiento
                </option>

                <option value="4">
                  Transporte
                </option>

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
        color: gasto.categoria?.color
      }}
  >
    {gasto.categoria?.nombre}
  </span>
                          </td>

                          <td className="monto">
                            ${gasto.monto}
                          </td>

                          <td>
                            {gasto.fecha}
                          </td>

                          <td>
                            <div className="act">
                              <button
                                  className="be"
                                  onClick={() => editarGasto(gasto)}
                              >
                                ✏
                              </button>
                              <button
                                  className="bd"
                                  onClick={() => console.log("ELIMINAR", gasto.id)}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel derecho */}
                <div>
                  <div className="total-card">
                    <div className="total-label">Total Gastos</div>
                    <div className="total-amount">$103.00</div>
                  </div>
                  <div className="pie-card">
                    <div className="pie-title">Por categoría</div>
                    <div className="chart-box">
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className="legend">
                      <div className="leg-item"><span className="dot" style={{ background: "#1a5c2a" }} />Alimentación $50</div>
                      <div className="leg-item"><span className="dot" style={{ background: "#185fa5" }} />Servicios $30</div>
                      <div className="leg-item"><span className="dot" style={{ background: "#4a1a8c" }} />Entret. $15</div>
                      <div className="leg-item"><span className="dot" style={{ background: "#ef9f27" }} />Transp. $8</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ========== CATEGORÍAS ========== */}
        {page === "categorias" && <Categorias />}
          <>
            <div className="topbar">
              <span className="topbar-title">Categorías</span>
              <button className="btn-nuevo">+ Nueva Categoría</button>
            </div>
            <div className="content">
              {[
                { color: "#1a5c2a", nombre: "Alimentación", gastos: 4 },
                { color: "#185fa5", nombre: "Servicios",    gastos: 2 },
                { color: "#4a1a8c", nombre: "Entretenimiento", gastos: 3 },
                { color: "#ef9f27", nombre: "Transporte",   gastos: 5 },
              ].map((cat) => (
                <div className="cat-card" key={cat.nombre}>
                  <div className="cat-info">
                    <div className="cat-dot" style={{ background: cat.color }} />
                    <span className="cat-nombre">{cat.nombre}</span>
                  </div>
                  <div className="cat-actions">
                    <span className="cat-count">{cat.gastos} gastos</span>
                    <button
                        className="be"
                        onClick={() => {
                          setEditandoId(gasto.id);
                          setDescripcion(gasto.descripcion);
                          setCategoria(gasto.categoria);
                          setMonto(gasto.monto);
                          setFecha(gasto.fecha);
                          setMostrarModal(true);
                        }}
                    >
                      ✏
                    </button>

                    <button
                        className="bd"
                        onClick={() => console.log("ELIMINAR", gasto.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>


        {/* ========== REPORTES ========== */}
        {page === "reportes" && <Reportes />}
          <>
            <div className="topbar">
              <span className="topbar-title">Reportes</span>
            </div>
            <div className="content">
              <div className="rep-cards">
                <div className="total-card" style={{ textAlign: "left" }}>
                  <div className="total-label">Total del mes</div>
                  <div className="total-amount">$103.00</div>
                </div>
                <div className="total-card" style={{ textAlign: "left" }}>
                  <div className="total-label">Mayor gasto</div>
                  <div className="rep-mayor">Alimentación</div>
                  <div className="rep-sub">$50.00 · 49%</div>
                </div>
              </div>

              <div className="pie-card">
                <div className="pie-title">Distribución por categoría</div>
                <div className="rep-chart-row">
                  <div className="chart-box-rep">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                  <div className="rep-legend">
                    {[
                      { color: "#1a5c2a", label: "Alimentación", pct: "49%" },
                      { color: "#185fa5", label: "Servicios",    pct: "29%" },
                      { color: "#4a1a8c", label: "Entretenimiento", pct: "15%" },
                      { color: "#ef9f27", label: "Transporte",   pct: "7%"  },
                    ].map((r) => (
                      <div className="rep-leg-row" key={r.label}>
                        <div className="rep-leg-left">
                          <span className="dot" style={{ background: r.color }} />
                          {r.label}
                        </div>
                        <strong>{r.pct}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>

      </div>
      {mostrarModal && (
          <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
              }}
          >
            <div
                style={{
                  background: "#fff",
                  padding: "30px",
                  borderRadius: "12px",
                  width: "400px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
            >
              <h2>Editar Gasto</h2>

              <div style={{ marginBottom: "15px" }}>
                <label>Descripción</label>

                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px"
                    }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Categoría</label>

                <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                      background: "#f5f5f5"
                    }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Monto</label>

                <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px"
                    }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Fecha</label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px"
                    }}
                />
              </div>




              {error && (
                  <p
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginTop: "10px"
                      }}
                  >
                    {error}
                  </p>
              )}

              <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px"
                  }}
              >
                <button
                    onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>

                <button
                    disabled={
                        descripcion.trim() === "" ||
                        categoria.trim() === "" ||
                        monto === "" ||
                        fecha === ""
                    }
                    style={{
                      background:
                          descripcion.trim() === "" ||
                          categoria.trim() === "" ||
                          monto === "" ||
                          fecha === ""
                              ? "#999"
                              : "#28a745",

                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "6px",

                      cursor:
                          descripcion.trim() === "" ||
                          categoria.trim() === "" ||
                          monto === "" ||
                          fecha === ""
                              ? "not-allowed"
                              : "pointer"
                    }}
                    onClick={() => {

                      if (
                          descripcion.trim() === "" ||
                          categoria.trim() === "" ||
                          monto === "" ||
                          fecha === ""
                      ) {
                        setError("Todos los campos son obligatorios");
                        return;
                      }

                      guardarEdicion();
                    }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default App;
