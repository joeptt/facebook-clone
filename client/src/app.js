import { Component } from "react";
import Profile from "./profile";
//wimport ProfilePicture from "./profilePicture";
import { BrowserRouter, Route } from "react-router-dom";
//import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import Navbar from "./navbar";
import Friends from "./friends";
import Chat from "./groupChat";

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
        };

        this.onClickImage = this.onClickImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadBio = this.onUploadBio.bind(this);
        this.onUploadCover = this.onUploadCover.bind(this);
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
            <BrowserRouter>
                <Route exact path="/group-chat">
                    <Chat />
                </Route>
                <Route exact path="/friends">
                    <Friends
                        onClickLogout={this.onClickLogout}
                        {...this.state}
                    />
                </Route>
                <Route exact path="/">
                    <div className="app">
                        <Navbar
                            onClickLogout={this.onClickLogout}
                            {...this.state}
                        />

                        <main className="container">
                            <div id="sidebar-left-homepage"></div>
                            <div id="feed-homepage"></div>
                            <div id="sidebar-right-homepage"></div>
                        </main>

                        <footer></footer>
                    </div>
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
            </BrowserRouter>
        );
    }
}
