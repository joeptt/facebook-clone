import { Component } from "react";
import ProfileModal from "./profilePictureModal";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            profile_picture_url: "",
            modalShown: false,
        };

        this.onClickImage = this.onClickImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }
    onClickImage() {
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

    async componentDidMount() {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        this.setState({
            first_name: data.first_name,
            last_name: data.last_name,
            profile_picture_url: data.profile_picture_url,
        });
    }
    render() {
        return (
            <div className="app">
                <header>
                    <nav>Home</nav>
                    <img
                        onClick={this.onClickImage}
                        id="profilePictureHeader"
                        src={
                            this.state.profile_picture_url
                                ? this.state.profile_picture_url
                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                    />
                </header>
                <main className="container">
                    <h1>
                        Welcome back {this.state.first_name}{" "}
                        {this.state.last_name}
                    </h1>
                </main>

                <footer>2020 ACME</footer>
                {this.state.modalShown && (
                    <ProfileModal
                        closeModal={this.closeModal}
                        onUpload={this.onUpload}
                    />
                )}
            </div>
        );
    }
}
