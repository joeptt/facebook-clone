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
            <div id="login-page">
                {this.state.showRegistration && (
                    <Registration closeRegister={this.closeRegister} />
                )}
                <RecentLogins />
                {/* if there is cookies then show RecentLogins if not show Text saying no recent logins aavailabe  */}
                <div id="login-input-div">
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-field-login">
                            <input
                                onChange={this.handleChange}
                                type="text"
                                name="email"
                                placeholder="&nbsp;"
                            />
                            <label htmlFor="email" className="placeholder">
                                E-Mail
                            </label>
                        </div>
                        <div className="input-field-login">
                            <input
                                onChange={this.handleChange}
                                type="password"
                                name="password"
                                placeholder="&nbsp;"
                            />
                            <label htmlFor="password" className="placeholder">
                                Password
                            </label>
                        </div>
                        {this.state.error && <p>Oops, something went wrong!</p>}
                        <button id="login-button">Log In</button>
                    </form>

                    <Link to="/reset-password" id="forgot-password-link">
                        Forgot password?{" "}
                    </Link>
                    <div id="break-line-login"></div>
                    <button id="create-new-account" onClick={this.showRegister}>
                        Create new account
                    </button>
                    <br></br>
                </div>
            </div>
        );
    }
}
