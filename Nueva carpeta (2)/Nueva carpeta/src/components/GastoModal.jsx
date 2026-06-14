import { useState } from "react";

function GastoModal({ categorias, onGuardar, gasto }) {

    const [form, setForm] = useState({
        descripcion: gasto?.descripcion || "",
        monto: gasto?.monto || "",
        fecha: gasto?.fecha || "",
        categoriaId: gasto?.categoria?.id || ""
    });
    const formularioValido =
        form.descripcion.trim() !== "" &&
        form.monto !== "" &&
        form.fecha !== "" &&
        form.categoriaId !== "";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar(form);
    };


    return (
        <div className="modal">
            <h2>{gasto ? "Editar Gasto" : "Nuevo Gasto"}</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Descripción</label>
                    <input
                        type="text"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                    />
                    {form.descripcion.trim() === "" && (
                        <small style={{ color: "red" }}>
                            La descripción es obligatoria
                        </small>
                    )}
                </div>

                <div>
                    <label>Monto</label>
                    <input
                        type="number"
                        step="0.01"
                        name="monto"
                        value={form.monto}
                        onChange={handleChange}
                        required
                    />
                    {form.monto === "" && (
                        <small style={{ color: "red" }}>
                            El monto es obligatorio
                        </small>
                    )}
                </div>

                <div>
                    <label>Fecha</label>
                    <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                    />
                    {form.fecha === "" && (
                        <small style={{ color: "red" }}>
                            La fecha es obligatoria
                        </small>
                    )}
                </div>

                <div>
                    <label>Categoría</label>
                    <select
                        name="categoriaId"
                        value={form.categoriaId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione</option>

                        {categorias.map((categoria) => (
                            <option
                                key={categoria.id}
                                value={categoria.id}
                            >
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    {form.fecha === "" && (
                        <small style={{ color: "red" }}>
                            La fecha es obligatoria
                        </small>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!formularioValido}
                    style={{
                        backgroundColor: formularioValido ? "#28a745" : "#cccccc",
                        color: "white",
                        cursor: formularioValido ? "pointer" : "not-allowed"
                    }}
                >
                    Guardar
                </button>

            </form>
        </div>
    );
}

export default GastoModal;