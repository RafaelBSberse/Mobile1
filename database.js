import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = process.env.EXPO_PUBLIC_PROJECT_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_ANON_KEY;

const supabase = createClient(PROJECT_URL, ANON_KEY)

export const insertTask = async (
    taskname,
    taskdescription,
    taskdate,
    tasktime,
    callback
) => {
    const { data, error } = await supabase
        .from('tasks')
        .insert([
            { taskname, taskdescription, taskdate, tasktime }
        ])
        .select("id");
    if (error) console.log("Error inserting data", error);
    else {
        console.log("Data inserted successfully", data);
        callback && callback(data[0].id);
    }
};

export const insertTaskContact = async (taskid, contactid) => {
    const { data, error } = await supabase
        .from('taskscontacts')
        .insert([
            { taskid, contactid }
        ]);
    if (error) console.log("Error inserting TasksContacts", error);
    else console.log("TasksContacts inserted successfully");
};

export const fetchTasksForList = async (setTasks) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('id, taskname');
    if (error) console.log("Error fetching tasks", error);
    else setTasks(data.map(item => ({ id: item.id, taskName: item.taskname })));
};

export const fetchContactsForList = async (setContacts) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('id, name, phone');
    if (error) console.log("Error fetching tasks", error);
    else setContacts(data);
};

export const deleteTask = async (id) => {
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .match({ id });
    if (error) console.log("Error deleting task", error);
    else console.log("Task deleted successfully");
};

export const deleteTaskContactsByTaskId = async (idTask) => {
    const { data, error } = await supabase
        .from('taskscontacts')
        .delete()
        .match({ taskid: idTask });
    if (error) console.log("Error deleting TaskContacts", error);
    else console.log("TaskContacts deleted successfully");
};

export const deleteTaskContactsByContactId = async (idContact) => {
    const { data, error } = await supabase
        .from('taskscontacts')
        .delete()
        .match({ contactid: idContact });
    if (error) console.log("Error deleting TaskContacts", error);
    else console.log("TaskContacts deleted successfully");
};

export const deleteContact = async (id) => {
    const { data, error } = await supabase
        .from('contacts')
        .delete()
        .match({ id });
    if (error) console.log("Error deleting task", error);
    else console.log("Contact deleted successfully");
};

export const updateTask = async (id, taskname, taskdescription, date, time) => {
    const { data, error } = await supabase
        .from('tasks')
        .update({ taskname, taskdescription, taskdate: date, tasktime: time })
        .match({ id });
    if (error) console.log("Error updating task", error);
    else console.log("Task updated successfully");
};

export const getTaskById = async (id, callback) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .match({ id });
    if (error) console.log("Error fetching task", error);
    else {
        callback && callback({
            taskName: data[0].taskname,
            taskDescription: data[0].taskdescription,
            taskDate: data[0].taskdate,
            taskTime: data[0].tasktime
        });

        console.log("Task fetched successfully");
    }
};

export const getContactIdsByTaskId = async (taskid, callback) => {
    const { data, error } = await supabase
        .from('taskscontacts')
        .select('contactid')
        .match({ taskid });
    if (error) console.log("Error fetching contact ids", error);
    else {
        const ids = data.map(item => item.contactid);
        callback(ids);
    }
};

export const insertContact = async (name, email, phone) => {
    const { data, error } = await supabase
        .from('contacts')
        .insert([
            { name, email, phone }
        ]);
    if (error) console.log("Error inserting into Contacts", error);
    else console.log("Contact added successfully", data);
};