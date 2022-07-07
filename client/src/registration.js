import { useState } from "react";

export default function Registration({ closeRegister }) {
    const [newUser, setNewUser] = useState({});
    const [error, setError] = useState();

    const handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;

        setNewUser((prevalue) => {
            return {
                ...prevalue,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("USER TRIED TO SUBMIT", newUser);
        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            const result = await res.json();
            console.log("Added to DB ->", result.success);
            if (result.success) {
                location.reload();
            } else {
                setError({
                    error: true,
                });
            }
        } catch (error) {
            console.log("Error on register ->", error);
        }
    };

    return (
        <div id="register-input-div">
            <div id="header-register">
                <h1>Sign Up</h1>
                <p>It’s quick and easy.</p>
                <img
                    src="https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/TdCEremeWv5.png"
                    onClick={closeRegister}
                    id="closeRegister"
                ></img>
            </div>
            <div id="line-register"></div>
            <form onSubmit={handleSubmit} className="registration-form">
                <div id="first-last-div">
                    <div className="input-field-registration-names">
                        <input
                            onChange={handleChange}
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="input-field-registration-names">
                        <input
                            onChange={handleChange}
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="input-field-registration">
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="E-Mail"
                    />
                </div>
                <div className="input-field-registration">
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                </div>
                <p id="terms-agree">
                    By clicking Sign Up, you agree to our Terms. Learn how we
                    collect, use and share your data in our Data Policy and how
                    we use cookies and similar technology in our Cookies Policy.
                    You may receive SMS Notifications from us and can opt out
                    any time.
                </p>
                {error && <p>Oops, something went wrong!</p>}
                <button id="register-button">Sign Up</button>
            </form>
        </div>
    );
}
