import { useState } from "react";

function Categorias() {

    const [nombre, setNombre] = useState("");
    const [color, setColor] = useState("#1a5c2a");

    const [categorias, setCategorias] = useState([
        {
            id: 1,
            nombre: "Alimentación",
            color: "#1a5c2a"
        },
        {
            id: 2,
            nombre: "Servicios",
            color: "#185fa5"
        }
    ]);

    const [editandoId, setEditandoId] = useState(null);

    const guardarCategoria = () => {

        if (!nombre.trim()) {
            alert("Ingrese un nombre");
            return;
        }

        if (editandoId) {

            const actualizadas = categorias.map((cat) =>
                cat.id === editandoId
                    ? {
                        ...cat,
                        nombre,
                        color
                    }
                    : cat
            );

            setCategorias(actualizadas);

            setEditandoId(null);

        } else {

            const nuevaCategoria = {
                id: Date.now(),
                nombre,
                color
            };

            setCategorias([
                ...categorias,
                nuevaCategoria
            ]);
        }

        setNombre("");
        setColor("#1a5c2a");
    };

    const editarCategoria = (cat) => {

        setNombre(cat.nombre);
        setColor(cat.color);

        setEditandoId(cat.id);
    };

    const eliminarCategoria = (id) => {

        const confirmar = window.confirm(
            "¿Desea eliminar esta categoría?"
        );

        if (!confirmar) return;

        const filtradas = categorias.filter(
            (cat) => cat.id !== id
        );

        setCategorias(filtradas);
    };

    return (
        <div>

            <div className="topbar">
                <span className="topbar-title">
                    Categorías
                </span>
            </div>

            <div className="content">

                <div className="form-categoria">

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                    />

                    <input
                        type="color"
                        value={color}
                        onChange={(e) =>
                            setColor(e.target.value)
                        }
                    />

                    <button onClick={guardarCategoria}>
                        {editandoId
                            ? "Actualizar"
                            : "Guardar"}
                    </button>

                </div>

                <table>

                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Color</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>

                    {categorias.map((cat) => (

                        <tr key={cat.id}>

                            <td>
                                {cat.nombre}
                            </td>

                            <td>
                                <span
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        background: cat.color
                                    }}
                                />
                            </td>

                            <td>

                                <button
                                    className="be"
                                    onClick={() =>
                                        editarCategoria(cat)
                                    }
                                >
                                    ✏
                                </button>

                                <button
                                    className="bd"
                                    onClick={() =>
                                        eliminarCategoria(cat.id)
                                    }
                                >
                                    🗑
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Categorias;