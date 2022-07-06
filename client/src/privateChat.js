import { useEffect } from "react";
import { socket } from "./socket";

export default function PrivateChat({
    friend_id,
    private_messages,
    onNewPrivateMessage,
    onClickChatClose,
}) {
    console.log(private_messages);
    async function onSubmit(e) {
        e.preventDefault();
        const message = e.target.message.value;
        socket.emit("sendPrivateMessage", { message, friend_id });
        e.target.message.value = "";
    }

    useEffect(() => {
        socket.on("newPrivateMessage", (data) => {
            console.log(data);
            onNewPrivateMessage(data);
        });
    }, []);

    return (
        <div className="private-chat-window">
            <div className="private-chat-x-div">
                <p className="private-chat-close" onClick={onClickChatClose}>
                    X
                </p>
            </div>
            <div className="private-chat-messages">
                {private_messages &&
                    private_messages.map((x) => {
                        return <p key={x.id}>{x.text}</p>;
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
