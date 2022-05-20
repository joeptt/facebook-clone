import { useState, useEffect } from "react";

import io from "socket.io-client";

let socket;

export default function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) {
            socket = io.connect();
        }

        socket.on("recentMessages", (data) => {
            setMessages([...data]);
        });

        return () => {
            socket.off("recentMessages");
            socket.off("newMessage");
            socket.disconnect();
            socket = null;
        };
    }, []);

    useEffect(() => {
        socket.on("newMessage", (data) => {
            setMessages([...messages, data]);
            console.log("messages after sending new one", messages);
        });
    }, [messages]);

    function onSubmit(event) {
        event.preventDefault();
        const text = event.target.text.value;
        socket.emit("sendMessage", text);
        event.target.text.value = "";
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            {console.log("messages in chat: ", messages)}
            {messages &&
                messages.map((message) => {
                    return (
                        <div key={message.id}>
                            <p>
                                {message.first_name} says: {message.text}
                            </p>
                        </div>
                    );
                })}
            <form onSubmit={onSubmit}>
                <input name="text"></input>
                <button>SEND MESSAGE</button>
            </form>
        </section>
    );
}
