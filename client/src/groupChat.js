import { useState, useEffect } from "react";
import Navbar from "./navbar";
import io from "socket.io-client";

let socket;

export default function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("MOUNTED");
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

    if (socket) {
        socket.on("newMessage", (data) => {
            setMessages([...messages, data]);
        });
    }

    function onSubmit(event) {
        event.preventDefault();
        const text = event.target.text.value;
        socket.emit("sendMessage", text);
        event.target.text.value = "";
    }

    return (
        <>
            <Navbar />
            <section className="chat">
                <h2>Chat</h2>
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
        </>
    );
}
