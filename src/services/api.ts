import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// DICA DE OURO PARA MOBILE + BACKEND LOCAL:
// Se estiver usando Emulador Android: 'http://10.0.2.2:3000' (O Android enxerga o localhost do PC assim)
// Se estiver usando Emulador iOS: 'http://localhost:3000'
// Se estiver rodando no Celular Físico via Expo Go: Coloque o IP da sua máquina na rede Wi-Fi (ex: 'http://192.168.1.15:3000')

const API_URL = "https://blogging-escola-backend.onrender.com"; // Substitua pelo IP da sua máquina"http://192.168.0.119:3000"

export const api = axios.create({
  baseURL: API_URL,
  //timeout: 10000,
});

// Interceptor: Pega o Token JWT do celular e injeta na requisição
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@app_token");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
