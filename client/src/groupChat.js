import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { socket } from "./socket";

export default function GroupChat({
    onClickLogout,
    first_name,
    profile_picture_url,
}) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("MOUNTED");
        socket.on("recentMessages", (data) => {
            setMessages([...data]);
        });
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
            <Navbar
                onClickLogout={onClickLogout}
                first_name={first_name}
                profile_picture_url={profile_picture_url}
            />
            <section className="chat">
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
                <form className="group-chat-form" onSubmit={onSubmit}>
                    <input name="text"></input>
                    <button>SEND MESSAGE</button>
                </form>
            </section>
        </>
    );
}
