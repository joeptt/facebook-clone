import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            currentStep: 1,
            code: "",
            new_password: "",
            email: "",
            errorOne: false,
            errorTwo: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        const res = await fetch("/reset-password", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-type": "application/json",
            },
        });
        const data = await res.json();
        console.log("DATA ->", data);

        if (this.state.currentStep === 1) {
            if (data.successStepOne) {
                this.setState({
                    errorOne: false,
                    currentStep: 2,
                });
            } else {
                console.log("terror");
                this.setState({
                    errorOne: true,
                });
            }
        } else if (this.state.currentStep === 2) {
            if (data.successStepTwo) {
                this.setState({
                    errorTwo: false,
                    currentStep: 3,
                });
            } else {
                this.setState({
                    errorTwo: true,
                });
            }
        }
    }

    render() {
        if (this.state.currentStep === 1) {
            return (
                <>
                    <h1> ENTER EMAIL </h1>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            onChange={this.handleChange}
                            type="text"
                            name="email"
                            placeholder="E-Mail..."
                        ></input>
                        {this.state.errorOne && <p>Please enter valid email</p>}
                        <button>Send</button>
                    </form>
                </>
            );
        } else if (this.state.currentStep === 2) {
            return (
                <>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            onChange={this.handleChange}
                            type="text"
                            name="code"
                            placeholder="Code..."
                        ></input>
                        <input
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            placeholder="New PW..."
                        ></input>
                        <button>Send</button>
                    </form>
                    {this.state.errorTwo && <p>Code invalid. Try again.</p>}
                </>
            );
        } else if (this.state.currentStep === 3) {
            return (
                <>
                    <h1>SUCCESSSSS</h1>
                    <h3>Password succesfully reset</h3>
                    <Link to="/">Go to login</Link>
                </>
            );
        }
    }
}
