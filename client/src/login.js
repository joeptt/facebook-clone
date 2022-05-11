import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                <h1>LOGIN!</h1>
                {this.state.error && <p>Oops, something went wrong!</p>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="email"
                        placeholder="E-Mail..."
                    ></input>
                    <input
                        onChange={this.handleChange}
                        type="password"
                        name="password"
                        placeholder="Password..."
                    ></input>
                    <button>Login</button>
                </form>

                <Link to="/">New? Register now!</Link>
                <br></br>

                <Link to="/reset-password">Forgot password? reset.</Link>
            </>
        );
    }
}
