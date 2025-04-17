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

    async createVeiculo(modelo: string, placa: string) {
        const response = await api.post("/veiculos/create", { modelo, placa });
        return response.data;
    }
}
