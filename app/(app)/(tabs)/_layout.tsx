import { RootState } from "@/src/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

export default function AppLayout() {
  // puxa o usuário da memória
  const user = useSelector((state: RootState) => state.auth.user);

  // cria a variável para facilitar: É professor ou admin? (true/false)
  const isTeacherOrAdmin = user?.role === "professor" || user?.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Só mostra a aba de Gerenciar se for professor ou admin */}
      <Tabs.Screen
        name="manage"
        options={{
          title: "Gerenciar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),

          href: isTeacherOrAdmin ? "/manage" : null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
