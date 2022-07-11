import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function PrivateChat({ friend_id, onClickChatClose }) {
    const [privateMessages, setPrivateMessage] = useState([]);
    const [chatUser, setChatUser] = useState();

    useEffect(() => {
        socket.emit("getAllPrivateMessages", friend_id);
        socket.on("receivePrivateMessages", (messages) => {
            console.log(messages);
            setPrivateMessage(messages.reverse());
            let user;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].sender_id === friend_id) {
                    user = messages[i];
                    setChatUser(user);
                    return;
                }
            }
        });
        return () => {
            socket.off("receivePrivateMessages");
            socket.off("getAllPrivateMessages");
        };
    }, []);

    if (socket) {
        socket.on("newPrivateMessage", (data) => {
            setPrivateMessage([...privateMessages, data]);
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const message = e.target.message.value;
        socket.emit("sendPrivateMessage", { message, friend_id });
        e.target.message.value = "";
    }

    return (
        <div className="private-chat-window">
            <div className="private-chat-x-div">
                <div>
                    {chatUser && (
                        <div>
                            <img
                                src={
                                    chatUser.profile_picture_url
                                        ? chatUser.profile_picture_url
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                            ></img>
                            <p>
                                {chatUser.first_name} {chatUser.last_name}
                            </p>
                        </div>
                    )}
                </div>
                <p className="private-chat-close" onClick={onClickChatClose}>
                    X
                </p>
            </div>

            <div className="private-chat-messages">
                {privateMessages &&
                    privateMessages.map((x) => {
                        if (x.sender_id === friend_id) {
                            return (
                                <div
                                    className={"private-message-friend"}
                                    key={x.id}
                                >
                                    <img
                                        src={
                                            x.profile_picture_url
                                                ? x.profile_picture_url
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                        }
                                    ></img>
                                    <p>{x.text}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    className={"private-message-user"}
                                    key={x.id}
                                >
                                    <p>{x.text}</p>
                                    <img
                                        src={
                                            x.profile_picture_url
                                                ? x.profile_picture_url
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                        }
                                    ></img>
                                </div>
                            );
                        }
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
