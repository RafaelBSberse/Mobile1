import * as Notifications from "expo-notifications";

export const useSendNotification = () => {
    return async ({ title, body, data }) => {
        const { status } = await Notifications.requestPermissionsAsync();

        console.log(title, body, data);

        if (status !== "granted") {
            console.error("Permission for notifications was not granted");
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
            },
            trigger: null,
        });
    };
};