import axios from "axios";

const API_URL = "http://localhost:8080/api/categorias";

// GET /api/categorias
export const obtenerCategorias = () => {
    return axios.get(API_URL);
};

// GET /api/categorias/{id}
export const obtenerCategoriaPorId = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// POST /api/categorias
export const crearCategoria = (categoria) => {
    return axios.post(API_URL, categoria);
};

// PUT /api/categorias/{id}
export const actualizarCategoria = (id, categoria) => {
    return axios.put(`${API_URL}/${id}`, categoria);
};

// DELETE /api/categorias/{id}
export const eliminarCategoria = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};