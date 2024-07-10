import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Contacts from 'expo-contacts';
import { fetchContactsForList, insertContact } from '../database';

const BACKGROUND_FETCH_TASK = 'background-obter-contatos';

async function fetchAndSaveContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') {
        console.log('Permissão para acessar contatos não foi concedida');
        return;
    }

    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
    });

    if (data.length === 0) {
        console.log('Nenhum contato encontrado');
        return;
    }

    const contatosCadastrados = fetchContactsForList();

    const novosContatos = data.filter((contact) => {
        return !contatosCadastrados.some((contato) => {
            return contato.name === contact.name;
        });
    });

    if (novosContatos.length > 0) {
        novosContatos.forEach(async (contact) => {
            const name = contact.name;
            const email = contact.emails ? contact.emails[0].email : '';
            const phone = contact.phoneNumbers ? contact.phoneNumbers[0].number : '';

            await insertContact(name, email, phone);
        });
    }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        console.log("BackgroundFetch Executado!");
        await fetchAndSaveContacts();
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.log(error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 2,
        stopOnTerminate: false,
        startOnBoot: true,
    });
}

function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export {
    registerBackgroundFetchAsync,
    unregisterBackgroundFetchAsync,
}