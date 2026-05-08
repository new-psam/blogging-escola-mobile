export interface Post {
  id?: string;
  _id?: string; // Para compatibilidade com o MongoDB, que usa _id
  titulo: string;
  conteudo: string;
  autor: string;
  dataCriacao: string | Date;
}

export interface Comment {
  _id: string;
  postId: string;
  autor: string;
  texto: string;
  dataCriacao: string | Date;
}

export interface User {
  _id: string;
  nome: string;
  email: string;
  role: "admin" | "professor" | "aluno";
  dataCriacao?: string;
}
