import React, { useState } from "react";
import { View, Button, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteContact, fetchContactsForList } from "../database";

const ContactList = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchContactsForList(setContacts);
        }, [])
    );

    const handleDelete = (id) => {
        deleteContact(id);
        fetchContactsForList(setContacts);
    }

    return (
        <View>
            <Button
                title="Adicionar Contato"
                onPress={() => navigation.navigate("Adicionar Contato")}
            />
            <FlatList
                style={styles.list}
                data={contacts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                        <Text>{item.phone}</Text>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDelete(item.id)}>
                            <Icon name="trash" size={30} color="#900" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Button
                title="Tarefas"
                onPress={() => navigation.navigate("Lista de Tarefas")}
            />
        </View>
    );
};

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
        alignItems: "center",
    },
    list: {
        height: "90%",
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

export default ContactList;
