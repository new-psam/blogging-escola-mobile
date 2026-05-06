import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//1. O usuário é um espelho exato do seu MongoDB!
interface User {
  _id: string;
  nome: string;
  email: string;
  role: string;
}

// 2. Define o formato dos dados de usuário e permissão
interface AuthState {
  user: User | null;
  token: string | null; // Se precisar guardar o token JWT do backend
}

// 3. Estado inicial quando o app acaba de abrir
const initialState: AuthState = {
  user: null,
  token: null,
};

// 4. Cria a fatia (slice) de autenticação
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Agora o login recebe o usuário e o Token assinadopelo Node.js
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
