import { Component } from "react";
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log(this.state)
        );
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log("USER TRIED TO SUBMIT");
        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: this.state.first,
                    last_name: this.state.last,
                    email: this.state.email,
                    password: this.state.password,
                }),
            });
            const result = await res.json();
            console.log("Result ->", result.success);
            if (result.success) {
                location.reload();
            } else {
                this.setState({
                    error: true,
                });
            }
        } catch (error) {
            console.log("Error on register ->", error);
        }
    }
    render() {
        return (
            <>
                <h1>SIGN UP!</h1>
                {this.state.error && <p>Oops, something went wrong!</p>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="first"
                        placeholder="First Name..."
                    />
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="last"
                        placeholder="Last Name..."
                    />
                    <input
                        onChange={this.handleChange}
                        type="email"
                        name="email"
                        placeholder="Email Address..."
                    />
                    <input
                        onChange={this.handleChange}
                        type="password"
                        name="password"
                        placeholder="Password..."
                    />
                    <button>Submit</button>
                </form>
                <Link to="/login">Already have an Account? Log In</Link>
            </>
        );
    }
}
