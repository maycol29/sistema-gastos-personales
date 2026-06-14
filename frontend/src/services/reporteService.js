import axios from "axios";

const API_URL = "http://localhost:8080/api/reportes";

export const obtenerGastosPorCategoria = () => {
    return axios.get(`${API_URL}/gastos-por-categoria`);
};