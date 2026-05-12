import { api } from "@/src/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";

// tipagem
export interface User {
  _id: string;
  nome: string;
  email: string;
  role: string;
}

export function useManageUsers() {
  const currentUser = useSelector((state: any) => state.auth.user);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"professor" | "aluno">("professor");
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/users`);
      setAllUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, []),
  );

  // REGRA DE NEGÓCIO AQUI:
  // Filtramos os usuários localmente. A troca de abas fica imediata!
  const displayedUsers = allUsers.filter((user) => {
    if (filter === "aluno") return user.role === "aluno";
    // Na aba professor, mostramos Professores E Admins!
    return user.role === "professor" || user.role === "admin";
  });

  const handleDelete = async (id: string, nome: string) => {
    // 🌟 A TRAVA DE SEGURANÇA MÁXIMA AQUI:
    if (id === currentUser?._id) {
      return Alert.alert(
        "Ação Bloqueada 🛑",
        "Você não pode excluir a sua própria conta de Administrador. Peça para outro Admin fazer isso, se necessário.",
      );
    }

    Alert.alert(
      "Excluir Usuário",
      `Tem certeza que deseja excluir ${nome}? Essa ação não poderá ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/users/${id}`);
              Alert.alert("Sucesso", "Usuário excluído com sucesso!");
              fetchUsers(); // recarrega a lista
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o usuário.");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (id: string) => {
    // Se o TypeScript ainda reclamar da linha abaixo, use o // @ts-ignore

    router.push(`/(app)/users/${id}` as any);
  };

  const handleCreate = () => {
    // Passamos o filtro atual como parâmetro para a tela de criação já saber se é aluno ou professor
    // Correção: Adicionado o (admin) na rota para ficar igual à sua árvore de arquivos
    router.push({
      pathname: "/(app)/users/create",
      params: { role: filter },
    });
  };

  return {
    users: displayedUsers,
    isLoading,
    filter,
    setFilter,
    handleDelete,
    handleEdit,
    handleCreate,
  };
}
