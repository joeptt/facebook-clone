import { BrowserRouter, Route } from "react-router-dom";

import ResetPassword from "./resetPassword";
import Login from "./login";

export default function Welcome() {
    return (
        <section>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
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
