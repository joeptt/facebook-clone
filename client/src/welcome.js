import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import ResetPassword from "./resetPassword";
import Login from "./login";

export default function Welcome() {
    return (
        <section>
            <h1>Welcome !!!</h1>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/reset-password">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </section>
    );
}
