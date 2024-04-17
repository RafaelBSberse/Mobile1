import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TasksDB");

export const initDB = () => {
    createTaskTable();
    createContactsTable();
    createTasksContactsTable();
};

export const createTaskTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT, taskDescription TEXT, taskDate DATE, taskTime TIME);",
            [],
            () => console.log("Table created successfully"),
            (_, error) => {
                console.log("Error creating table", error);
                return true;
            }
        );
    });
};

export const createContactsTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT);",
            [],
            () => console.log("Contacts table created successfully"),
            (_, error) => {
                console.log("Error creating Contacts table", error);
                return true;
            }
        );
    });
};

export const createTasksContactsTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TasksContacts (taskId INTEGER, contactId INTEGER, PRIMARY KEY(taskId, contactId), FOREIGN KEY(taskId) REFERENCES Tasks(id), FOREIGN KEY(contactId) REFERENCES Contacts(id));",
            [],
            () => console.log("TasksContacts table created successfully"),
            (_, error) => {
                console.log("Error creating TasksContacts table", error);
                return true;
            }
        );
    });
};

export const closeDB = () => {
    db._db.close();
    () => {
        console.log("Database closed!");
    },
        (error) => {
            console.error("Error closing database", error);
        };
};

export const dropTableTasks = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS Tasks;",
            [],
            () => console.log("Table dropped successfully"),
            (_, error) => {
                console.log("Error dropping table", error);
                return true;
            }
        );
    });
};

export const dropTableContacts = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS Contacts;",
            [],
            () => console.log("Table dropped successfully"),
            (_, error) => {
                console.log("Error dropping table", error);
                return true;
            }
        );
    });
};

export const dropTable = () => {
    dropTableTasks();
    dropTableContacts();
    dropTableTasksContacts();
}

export const dropTableTasksContacts = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS TasksContacts;",
            [],
            () => console.log("Table dropped successfully"),
            (_, error) => {
                console.log("Error dropping table", error);
                return true;
            }
        );
    });
};

export const insertTask = (
    taskName,
    taskDescription,
    taskDate,
    taskTime,
    callback
) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO Tasks (taskName, taskDescription, taskDate, taskTime) values (?, ?, ?, ?)",
            [taskName, taskDescription, taskDate, taskTime],
            (_, resultSet) => {
                console.log("Data inserted successfully", resultSet);
                callback && callback(resultSet.insertId);
            },
            (_, error) => {
                console.log("Error inserting data", error);
                return true;
            }
        );
    });
};

export const insertTaskContact = (taskId, contactId) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO TasksContacts (taskId, contactId) VALUES (?, ?);",
            [taskId, contactId],
            (_, resultSet) => {
                console.log("TasksContacts inserted successfully");
            },
            (_, error) => {
                console.log("Error inserting TasksContacts", error);
                return true;
            }
        );
    });
};

export const fetchTasksForList = (setTasks) => {
    console.log("carregando")

    db.transaction((tx) => {
        tx.executeSql(
            "SELECT id, taskName FROM Tasks;",
            [],
            (_, resultSet) => setTasks(resultSet.rows._array),
            (_, error) => {
                console.log("Error fetching tasks", error);
                return true;
            }
        );
    });
};

export const fetchContactsForList = (setContacts) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT id, name, phone FROM Contacts;",
            [],
            (_, resultSet) => setContacts(resultSet.rows._array),
            (_, error) => {
                console.log("Error fetching tasks", error);
                return true;
            }
        );
    });
};

export const deleteTask = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM Tasks WHERE id = ?;",
            [id],
            (_, resultSet) => {
                console.log("Task deleted successfully");
            },
            (_, error) => {
                console.log("Error deleting task", error);
                return true;
            }
        );
    });
};

export const deleteContact = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM Contacts WHERE id = ?;",
            [id],
            (_, resultSet) => {
                console.log("Contact deleted successfully");
            },
            (_, error) => {
                console.log("Error deleting task", error);
                return true;
            }
        );
    });
};

export const updateTask = (id, taskName, taskDescription, date, time) => {
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE Tasks SET taskName = ?, taskDescription = ?, date = ?, time = ? WHERE id = ?;",
            [taskName, taskDescription, date, time, id],
            (_, resultSet) => {
                console.log("Task updated successfully");
            },
            (_, error) => {
                console.log("Error updating task", error);
                return true;
            }
        );
    });
};

export const getTaskById = (id, callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM Tasks WHERE id = ?;",
            [id],
            (_, resultSet) => {
                callback && callback(resultSet.rows._array[0]);
                console.log("Task fetched successfully");
            },
            (_, error) => {
                console.log("Error fetching task", error);
                return true;
            }
        );
    });
};

export const getContactIdsByTaskId = (taskId, callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT contactId FROM TasksContacts WHERE taskId = ?;",
            [taskId],
            (_, resultSet) => {
                const ids = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    ids.push(resultSet.rows.item(i).contactId);
                }
                callback(ids);
            }
        );
    });
};

export const insertContact = (name, email, phone) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO Contacts (name, email, phone) values (?, ?, ?)",
            [name, email, phone],
            (_, resultSet) =>
                console.log("Contact added successfully", resultSet),
            (_, error) => {
                console.log("Error inserting into Contacts", error);
                return true;
            }
        );
    });
};
