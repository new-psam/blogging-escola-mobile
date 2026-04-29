import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define o formato dos dados de usuário e permissão
interface AuthState {
  user: { uid: string; email: string | null } | null;
  role: "admin" | "teacher" | "student" | null;
  isLoading: boolean; //útil para mostrar um loading enquanto o app abre e verifica o firebase
}

// 2. Estado inicial quando o app acaba de abrir
const initialState: AuthState = {
  user: null,
  role: null,
  isLoading: true,
};

// 3. Cria a fatia (slice) de autenticação
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Ação para salvar os dados básicos do Firebase (ID e Email)
    setUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null } | null>,
    ) => {
      state.user = action.payload;
    },
    // Ação para silvar apermissão que virá do Firestore (MOngoDB/Postgres no futuro)
    setRole: (
      state,
      action: PayloadAction<"admin" | "teacher" | "student" | null>,
    ) => {
      state.role = action.payload;
    },
    // Ação para avisar que terminadmos de carregar informações
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Ação para limpar tudo quando o usuário sair do app
    logoutApp: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, setRole, setLoading, logoutApp } = authSlice.actions;
export default authSlice.reducer;
