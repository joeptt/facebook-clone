import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

async function displayCorrectPage() {
    try {
        const res = await fetch("/user/id.json");
        const data = await res.json();
        console.log(data);
        if (!data.user_id) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("APP RENDER");
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    } catch (error) {
        console.log("error at starting website", error);
    }
}

displayCorrectPage();
