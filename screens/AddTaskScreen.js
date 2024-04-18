import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
} from "react-native";
import { deleteTaskContacts, fetchContactsForList, getContactIdsByTaskId, getTaskById, insertTask, insertTaskContact, updateTask } from "../database";
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from "@react-navigation/native";

export default function AddTaskScreen({ navigation, route }) {
    const { taskId = null } = route?.params ?? {};

    const [isEdit, setIsEdit] = useState(!taskId);

    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [openDropdownContacts, setOpenDropdownContacts] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchContactsForList((result) => {
                setContacts(result.map(contact => ({label: contact.name, value: contact.id})));
            });
        }, [])
    );

    useEffect(() => {
        if (taskId > 0) {
            getTaskById(taskId, (task) => {
                setTaskName(task.taskName);
                setTaskDescription(task.taskDescription);
                setDate(new Date(task.date));
                setTime(new Date(task.time));
            });

            getContactIdsByTaskId(taskId, setSelectedContacts);
        }
    }, [taskId]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShowDate(false);
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setTime(currentTime);
        setShowTimePicker(false);
    };

    const addTask = () => {
        const dateString = date.toISOString();
        const timeString = time.toISOString();

        if (taskId && taskId > 0) {
            updateTask(taskId, taskName, taskDescription, dateString, timeString);
            deleteTaskContacts(taskId);
            selectedContacts.forEach((contactId) => insertTaskContact(taskId, contactId));
            return;
        }

        insertTask(taskName, taskDescription, dateString, timeString, (taskIdReturn) => {
            selectedContacts.forEach((contactId) => insertTaskContact(taskIdReturn, contactId));
        });

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título da Tarefa</Text>
            <TextInput style={styles.input} onChangeText={setTaskName} editable={isEdit} />

            <Text style={styles.label}>Descrição da Tarefa</Text>
            <TextInput
                style={styles.input}
                multiline={true}
                numberOfLines={11}
                onChangeText={setTaskDescription}
                editable={isEdit}
            />

            <Text style={styles.label}>Contatos</Text>
            <DropDownPicker
                style={styles.input}
                items={contacts}
                multiple={true}
                multipleText={selectedContacts.map((idContato) => contacts.find((contato) => contato.value == idContato).label).join(", ")}
                value={selectedContacts}
                setValue={setSelectedContacts}
                open={openDropdownContacts}
                setOpen={setOpenDropdownContacts}
                placeholder="Selecione os contatos"
            />

            <Text style={styles.label}>Data da Tarefa</Text>
            <Text style={styles.input} onPress={() => isEdit && setShowDate(true)}>
                {date.toLocaleDateString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}
            </Text>
            {showDate && (
                <DateTimePicker
                    value={date}
                    mode={"date"}
                    display={"default"}
                    onChange={onChange}
                />
            )}

            <Text style={styles.label}>Horário da Tarefa</Text>
            <Text style={styles.input} onPress={() => isEdit && setShowTimePicker(true)}>
                {time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </Text>
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode={"time"}
                    display={"default"}
                    onChange={onTimeChange}
                />
            )}

            <Button
                title={isEdit ? ( taskId ? "Salvar Tarefa" : "Adicionar Tarefa" ) : "Editar Tarefa"}
                onPress={isEdit ? addTask : () => setIsEdit(true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        marginBottom: 15,
    },
});
