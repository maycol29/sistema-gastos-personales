import { useState, useEffect, useCallback } from "react";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categoriaService";

function Categorias() {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#1a5c2a");
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCategorias = useCallback(async () => {
    setCargando(true);
    try {
      const res = await obtenerCategorias();
      setCategorias(res.data);
    } catch (e) {
      setError("No se pudieron cargar las categorías");
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const guardarCategoria = async () => {
    if (!nombre.trim()) return;
    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, { nombre, color });
        setEditandoId(null);
      } else {
        await crearCategoria({ nombre, color });
      }
      setNombre("");
      setColor("#1a5c2a");
      await cargarCategorias();
    } catch (e) {
      setError("Error al guardar la categoría");
      console.error(e);
    } finally {
      setGuardando(false);
    }
  };

  const editarCategoria = (cat) => {
    setNombre(cat.nombre);
    setColor(cat.color || "#1a5c2a");
    setEditandoId(cat.id);
  };

  const cancelarEdicion = () => {
    setNombre("");
    setColor("#1a5c2a");
    setEditandoId(null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar esta categoría?")) return;
    try {
      await eliminarCategoria(id);
      await cargarCategorias();
    } catch (e) {
      setError("Error al eliminar la categoría");
      console.error(e);
    }
  };

  const valido = nombre.trim() !== "";

  return (
    <div>
      <div className="topbar">
        <span className="topbar-title">Categorías</span>
      </div>

      <div className="content">
        {error && (
          <div className="cat-error">
            ⚠ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* ── Formulario ── */}
        <div className="cat-form-card">
          <div className="cat-form-header">
            <span className="cat-form-title">
              {editandoId ? "✏ Editar categoría" : "＋ Nueva categoría"}
            </span>
          </div>
          <div className="cat-form-body">
            <div className="cat-field">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Alimentación, Transporte..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && valido && guardarCategoria()}
              />
            </div>
            <div className="cat-field cat-field-color">
              <label>Color</label>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className="color-hex">{color.toUpperCase()}</span>
                <span
                  className="color-preview-pill"
                  style={{ background: `${color}22`, color: color, border: `1px solid ${color}55` }}
                >
                  Vista previa
                </span>
              </div>
            </div>
            <div className="cat-form-actions">
              {editandoId && (
                <button className="btn-cat-cancel" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
              <button
                className="btn-cat-save"
                disabled={!valido || guardando}
                onClick={guardarCategoria}
              >
                {guardando ? "Guardando..." : editandoId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="cat-table-wrap">
          {cargando ? (
            <div className="cat-loading">Cargando categorías...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>ID</th>
                  <th>Nombre</th>
                  <th style={{ width: "120px" }}>Color</th>
                  <th style={{ width: "100px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id} className={editandoId === cat.id ? "cat-row-editing" : ""}>
                    <td style={{ color: "#aaa", fontSize: "11px" }}>{cat.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: cat.color,
                            flexShrink: 0,
                            display: "inline-block",
                          }}
                        />
                        <span style={{ fontWeight: 500 }}>{cat.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="pill"
                        style={{
                          background: `${cat.color}22`,
                          color: cat.color,
                          fontSize: "11px",
                          padding: "3px 8px",
                        }}
                      >
                        {cat.color?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="act">
                        <button className="be" title="Editar" onClick={() => editarCategoria(cat)}>
                          ✏
                        </button>
                        <button className="bd" title="Eliminar" onClick={() => handleEliminar(cat.id)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && !cargando && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#aaa", padding: "24px" }}>
                      No hay categorías. ¡Crea la primera!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categorias;
