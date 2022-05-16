import { Component } from "react";
import ProfileModal from "./profilePictureModal";
import Profile from "./profile";
import ProfilePicture from "./profilePicture";
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            profile_picture_url: "",
            modalShown: false,
            bio: "",
        };

        this.onClickImage = this.onClickImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadBio = this.onUploadBio.bind(this);
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
            bio: data.bio,
        });
    }
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/">
                    <div className="app">
                        <header>
                            <nav>Home</nav>
                            <button onClick={this.onClickLogout}>LOGOUT</button>
                            <div>
                                <FindPeople />
                            </div>
                            <ProfilePicture
                                profile_picture_url={
                                    this.state.profile_picture_url
                                }
                                onClickImage={this.onClickImage}
                            />
                        </header>
                        <main className="container"></main>

                        <footer></footer>
                        {this.state.modalShown && (
                            <ProfileModal
                                closeModal={this.closeModal}
                                onUpload={this.onUpload}
                            />
                        )}
                    </div>
                </Route>
                <Route exact path="/profile">
                    <Profile
                        {...this.state}
                        onUploadBio={this.onUploadBio}
                        profile_picture_url={this.state.profile_picture_url}
                    />
                </Route>
                <Route path="/user/:otherUserId">
                    <OtherProfile />
                </Route>
            </BrowserRouter>
        );
    }
}
