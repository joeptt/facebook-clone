import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function PrivateChat({ friend_id, onClickChatClose }) {
    const [privateMessages, setPrivateMessage] = useState([]);

    useEffect(() => {
        socket.emit("getAllPrivateMessages", friend_id);
        socket.on("receivePrivateMessages", (messages) => {
            console.log("messages", messages);
            setPrivateMessage(messages);
        });
        return () => {
            socket.off("receivePrivateMessages");
        };
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        const message = e.target.message.value;
        socket.emit("sendPrivateMessage", { message, friend_id });
        e.target.message.value = "";
        if (socket) {
            socket.on("newPrivateMessage", (data) => {
                console.log("newMessage", data);
                setPrivateMessage([...privateMessages, data]);
            });
        }
    }

    return (
        <div className="private-chat-window">
            <div className="private-chat-x-div">
                <p className="private-chat-close" onClick={onClickChatClose}>
                    X
                </p>
            </div>
            <div className="private-chat-messages">
                {privateMessages &&
                    privateMessages.map((x) => {
                        return (
                            <div key={x.id}>
                                <img src={x.profile_picture_url}></img>
                                <p>{x.text}</p>
                            </div>
                        );
                    })}
            </div>
            <div className="private-chat-input">
                <form onSubmit={onSubmit}>
                    <input name="message" placeholder="Type message..." />
                </form>
            </div>
        </div>
    );
}
