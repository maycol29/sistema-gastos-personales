import axios from "axios";

const API_URL = "http://localhost:8080/api/gastos";

// GET /api/gastos
export const obtenerGastos = () => {
    return axios.get(API_URL);
};

// GET /api/gastos/{id}
export const obtenerGastoPorId = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// POST /api/gastos
export const crearGasto = (gasto) => {
    return axios.post(API_URL, gasto);
};

// PUT /api/gastos/{id}
export const actualizarGasto = (id, gasto) => {
    return axios.put(`${API_URL}/${id}`, gasto);
};

// DELETE /api/gastos/{id}
export const eliminarGasto = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// GET /api/gastos/total
export const obtenerTotalGastos = () => {
    return axios.get(`${API_URL}/total`);
};
export const filtrarPorCategoria = (categoriaId) => {
    return axios.get(
        `${API_URL}/filtrar?categoriaId=${categoriaId}`
    );
};