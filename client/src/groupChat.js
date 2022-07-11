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
        socket.emit("getRecentMessages");
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
            <div className="group-Chat-page">
                <div className="group-Chat-messages-wrapper">
                    {messages &&
                        messages.map((message) => {
                            return (
                                <div
                                    className="group-chat-message"
                                    key={message.id}
                                >
                                    <p>
                                        <strong>{message.first_name}</strong>{" "}
                                        says: {message.text}
                                    </p>
                                </div>
                            );
                        })}
                </div>
                <div className="group-Chat-form-wrapper">
                    <form className="group-chat-form" onSubmit={onSubmit}>
                        <input name="text"></input>
                        <button>SEND</button>
                    </form>
                </div>
            </div>
        </>
    );
}
