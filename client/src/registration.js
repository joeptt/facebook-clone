import { Component } from "react";

export default class Registration extends Component {
    constructor(props) {
        super(props);
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
            <div id="register-input-div">
                <div id="header-register">
                    <h1>Sign Up</h1>
                    <p>It’s quick and easy.</p>
                    <img
                        src="https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TdCEremeWv5.png"
                        onClick={this.props.closeRegister}
                        id="closeRegister"
                    ></img>
                </div>
                <div id="line-register"></div>
                <form
                    onSubmit={this.handleSubmit}
                    className="registration-form"
                >
                    <div id="first-last-div">
                        <div className="input-field-registration-names">
                            <input
                                onChange={this.handleChange}
                                type="text"
                                name="first"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="input-field-registration-names">
                            <input
                                onChange={this.handleChange}
                                type="text"
                                name="last"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>
                    <div className="input-field-registration">
                        <input
                            onChange={this.handleChange}
                            type="email"
                            name="email"
                            placeholder="E-Mail"
                        />
                    </div>
                    <div className="input-field-registration">
                        <input
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                    <p id="terms-agree">
                        By clicking Sign Up, you agree to our Terms. Learn how
                        we collect, use and share your data in our Data Policy
                        and how we use cookies and similar technology in our
                        Cookies Policy. You may receive SMS Notifications from
                        us and can opt out any time.
                    </p>
                    {this.state.error && <p>Oops, something went wrong!</p>}
                    <button id="register-button">Sign Up</button>
                </form>
            </div>
        );
    }
}
