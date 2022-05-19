import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as immutableState from "redux-immutable-state-invariant";
import reducer from "./redux/reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

async function displayCorrectPage() {
    try {
        const res = await fetch("/user/id.json");
        const data = await res.json();
        console.log(data);
        if (!data.user_id) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("APP RENDER");
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    } catch (error) {
        console.log("error at starting website", error);
    }
}

displayCorrectPage();
