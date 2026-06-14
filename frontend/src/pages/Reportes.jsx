import { useEffect, useState } from "react";
import { obtenerGastosPorCategoria } from "../services/reporteService";

function Reportes() {

    const [reportes, setReportes] = useState([]);

    const cargarReportes = async () => {
        try {

            const response =
                await obtenerGastosPorCategoria();

            setReportes(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarReportes();
    }, []);

    return (
        <div>

            <div className="topbar">
                <span className="topbar-title">
                    Reportes
                </span>
            </div>

            <div className="content">

                <table>

                    <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Total Gastado</th>
                    </tr>
                    </thead>

                    <tbody>

                    {reportes.map((r, index) => (

                        <tr key={index}>

                            <td>
                                {r.categoria}
                            </td>

                            <td>
                                S/. {r.total}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Reportes;