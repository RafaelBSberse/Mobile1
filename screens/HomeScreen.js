import React, { useState } from "react";
import { View, Button, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { deleteTask, deleteTaskContacts, fetchTasksForList } from "../database";
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchTasksForList(setTasks);
        }, [])
    );

    const handleDelete = (id) => {
        deleteTask(id);
        deleteTaskContacts(id);
        fetchTasksForList(setTasks);
    }

    return (
        <View style={styles.container}>
            <Button
                title="Adicionar Tarefa"
                onPress={() => navigation.navigate("Adicionar Tarefa")}
            />
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity style={styles.titleContainer} onPress={() => navigation.navigate("Detalhes da Tarefa", { taskId: item.id })}>
                            <Text style={styles.title}>{item.taskName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDelete(item.id)}>
                            <Icon name="trash" size={30} color="#900" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Button
                title="Contatos"
                onPress={() => navigation.navigate("Lista de Contatos")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: "#f9c2ff",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
    },
    titleContainer: {
        width: "90%"
    },
    buttonContainer: {
        width: "10%"
    }
});
