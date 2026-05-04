import axios from "axios";

// DICA DE OURO PARA MOBILE + BACKEND LOCAL:
// Se estiver usando Emulador Android: 'http://10.0.2.2:3000' (O Android enxerga o localhost do PC assim)
// Se estiver usando Emulador iOS: 'http://localhost:3000'
// Se estiver rodando no Celular Físico via Expo Go: Coloque o IP da sua máquina na rede Wi-Fi (ex: 'http://192.168.1.15:3000')

const API_URL = "http://192.168.0.119:3000"; // Substitua pelo IP da sua máquina

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptador para injetar o Token do Firebase em todas as requisições (se necessário futuramente)
import { auth } from "./firebase";

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
