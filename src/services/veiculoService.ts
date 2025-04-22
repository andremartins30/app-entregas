import api from "./api";

export const veiculosService = {
    async getUserVeiculos() {
        const response = await api.get("/veiculos/list");
        return response.data;
    },

    async getTodosVeiculos() {
        const response = await api.get("/veiculos/list-all");
        return response.data;
    },

    async addVeiculo({ modelo, placa }) {
        const response = await api.post("/veiculos/create", { modelo, placa });
        return response.data;
    },

    async updateVeiculo(id: number, { modelo, placa }) {
        const response = await api.put(`/veiculos/${id}`, { modelo, placa });
        return response.data;
    },

    async deleteVeiculo(id: number) {
        const response = await api.delete(`/veiculos/${id}`);
        return response.data;
    }
}
