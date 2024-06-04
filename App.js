import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./screens/HomeScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import AddContactScreen from "./screens/AddContactScreen";
import ContactList from "./screens/ContactList";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Lista de Tarefas">
                <Stack.Screen name="Lista de Tarefas" component={HomeScreen} />
                <Stack.Screen name="Adicionar Tarefa" component={AddTaskScreen} />
                <Stack.Screen name="Detalhes da Tarefa" component={AddTaskScreen} />
                <Stack.Screen name="Adicionar Contato" component={AddContactScreen} />
                <Stack.Screen name="Lista de Contatos" component={ContactList} />
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}
