import { Component } from "react";
import { Link } from "react-router-dom";
import Registration from "./registration";
import RecentLogins from "./recentLogins";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            showRegistration: false,
            showRecentLogins: false,
            showFacebookText: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showRegister = this.showRegister.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
    }

    handleChange(e) {
        console.log([e.target.value]);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log(this.state)
        );
    }

    showRegister() {
        this.setState({
            showRegistration: true,
        });
    }
    closeRegister() {
        this.setState({
            showRegistration: false,
        });
    }

    async componentDidMount() {
        const res = await fetch("/recent-login-available");
        const result = await res.json();
        console.log("Result from availablitly check-> ", result);
        if (result.recentUser) {
            this.setState({
                showRecentLogins: true,
                showFacebookText: false,
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            });

            const result = await res.json();
            if (result.success === true) {
                console.log("user logged in successfully  -> ", result);
                location.reload();
            } else {
                this.setState({
                    error: true,
                });
            }
        } catch (error) {
            console.log("error on login ->", error);
        }
    }

    render() {
        return (
            <>
                <div id="login-page">
                    <div id="login-components">
                        {this.state.showRegistration && (
                            <Registration closeRegister={this.closeRegister} />
                        )}

                        {this.state.showRecentLogins && (
                            <RecentLogins showRegister={this.showRegister} />
                        )}

                        {this.state.showFacebookText && (
                            <div id="facebook-text">
                                <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" />
                                <h2>
                                    Connect with friends and the world <br></br>
                                    around you on Facebook.
                                </h2>
                            </div>
                        )}
                        <div id="login-input-div">
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-field-login">
                                    <input
                                        onChange={this.handleChange}
                                        id="email"
                                        type="text"
                                        name="email"
                                        placeholder="&nbsp;"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="placeholder"
                                    >
                                        E-Mail
                                    </label>
                                </div>
                                <div className="input-field-login">
                                    <input
                                        onChange={this.handleChange}
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="&nbsp;"
                                    />
                                    <label
                                        htmlFor="password"
                                        className="placeholder"
                                    >
                                        Password
                                    </label>
                                </div>
                                {this.state.error && (
                                    <p>Oops, something went wrong!</p>
                                )}
                                <button id="login-button">Log In</button>
                            </form>

                            <Link
                                to="/reset-password"
                                id="forgot-password-link"
                            >
                                Forgot password?{" "}
                            </Link>
                            <div id="break-line-login"></div>
                            <button
                                id="create-new-account"
                                onClick={this.showRegister}
                            >
                                Create new account
                            </button>
                            <br></br>
                        </div>
                    </div>
                </div>
                <div id="languages-div">
                    <ul id="languages">
                        <li>English (US)</li>
                        <li>Deutsch</li>
                        <li>Türkçe</li>
                        <li>Polski</li>
                        <li>Italiano</li>
                        <li>Română</li>
                        <li>Français</li>
                        <li>Русский</li>
                        <li>العربية</li>
                        <li>Español</li>
                        <li>Português</li>
                    </ul>
                </div>
            </>
        );
    }
}
