import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = async (token) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SERVER_WS, {
            auth: { token }
        });
        console.log("Socket initialized");
    }
    return socket;
}
