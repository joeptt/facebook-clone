import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        // Only establish one connection
        socket = io.connect();
    }
};
