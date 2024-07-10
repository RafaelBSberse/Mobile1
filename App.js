import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./screens/HomeScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import AddContactScreen from "./screens/AddContactScreen";
import ContactList from "./screens/ContactList";
import * as Notifications from "expo-notifications";

import { registerBackgroundFetchAsync } from "./tasks/taskAlert";

const Stack = createStackNavigator();

export default function App() {

    useEffect(() => {
        console.log('Registrando tarefa de background fetch...');

        registerBackgroundFetchAsync().then(() => {
            console.log('Tarefa de background fetch registrada com sucesso!');
        }).catch((error) => {
            console.error('Erro ao registrar tarefa de background fetch:', error);
        });

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: false,
              shouldSetBadge: false,
            }),
        });
    }, []);

    Notifications.getExpoPushTokenAsync().then((token) => {
        console.log(token);
    });

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
