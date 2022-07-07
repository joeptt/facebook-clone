import { Component } from "react";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";
import Friends from "./friends";
import GroupChat from "./groupChat";
import PrivateChat from "./privateChat";
import Feed from "./feed";
import { socket } from "./socket";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            profile_picture_url: "",
            cover_picture_url: "",
            modalShown: false,
            bio: "",
            friend_id: null,
            private_messages: [],
            chatShwon: false,
        };

        this.onClickImage = this.onClickImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadBio = this.onUploadBio.bind(this);
        this.onUploadCover = this.onUploadCover.bind(this);
        this.onClickFriend = this.onClickFriend.bind(this);
        this.onNewPrivateMessage = this.onNewPrivateMessage.bind(this);
        this.onClickChatClose = this.onClickChatClose.bind(this);
    }

    onClickFriend(friend_id) {
        this.setState({
            chatShown: true,
        });
        console.log("Hallo");
        socket.emit("getAllPrivateMessages", friend_id);

        socket.on("receivePrivateMessages", (data) => {
            this.setState({
                friend_id: friend_id,
                private_messages: data,
            });
        });
    }

    onClickChatClose() {
        this.setState({
            chatShown: false,
        });
    }

    onNewPrivateMessage(newMessage) {
        console.log("newMessage ", newMessage);
        console.log("this.state.privateMessages", this.state.private_messages);
        this.setState({
            private_messages: [...this.state.private_messages, newMessage],
        });
    }

    onClickLogout() {
        fetch("/logout")
            .then((res) => res.json())
            .then((data) => {
                console.log("LOGOUT", data.success);
                if (data.success === true) location.reload(true);
            });
    }

    onClickImage() {
        console.log("onclickimage runs");
        this.setState({
            modalShown: true,
        });
    }
    closeModal() {
        console.log("closing");
        this.setState({
            modalShown: false,
        });
    }

    onUpload(url) {
        console.log("this url is -> ", url);
        if (url) {
            this.setState({
                profile_picture_url: url,
            });
            location.reload();
        }
    }

    onUploadCover(url) {
        console.log("this cover photo url is -> ", url);
        if (url) {
            this.setState({
                cover_picture_url: url,
            });
            location.reload();
        }
    }

    onUploadBio(user) {
        this.setState({
            bio: user.bio,
        });
    }

    async componentDidMount() {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        this.setState({
            first_name: data.first_name,
            last_name: data.last_name,
            profile_picture_url: data.profile_picture_url,
            cover_picture_url: data.cover_picture_url,
            bio: data.bio,
        });
    }
    render() {
        return (
            <>
                <BrowserRouter>
                    <Route exact path="/">
                        <Feed
                            onClickLogout={this.onClickLogout}
                            user={this.state}
                            onClickFriend={this.onClickFriend}
                        />
                    </Route>
                    <Route exact path="/group-chat">
                        <GroupChat
                            onClickLogout={this.onClickLogout}
                            {...this.state}
                        />
                    </Route>
                    <Route exact path="/friends">
                        <Friends
                            onClickLogout={this.onClickLogout}
                            {...this.state}
                        />
                    </Route>
                    <Route exact path="/profile">
                        <Profile
                            {...this.state}
                            onUploadBio={this.onUploadBio}
                            closeModal={this.closeModal}
                            onUpload={this.onUpload}
                            onUploadCover={this.onUploadCover}
                            onClickLogout={this.onClickLogout}
                        />
                    </Route>
                    <Route path="/user/:otherUserId">
                        <OtherProfile
                            onClickLogout={this.onClickLogout}
                            {...this.state}
                        />
                    </Route>
                    {this.state.chatShown && (
                        <PrivateChat
                            friend_id={this.state.friend_id}
                            private_messages={this.state.private_messages}
                            onClickFriend={this.onClickFriend}
                            onNewPrivateMessage={this.onNewPrivateMessage}
                            onClickChatClose={this.onClickChatClose}
                        />
                    )}
                </BrowserRouter>
            </>
        );
    }
}
