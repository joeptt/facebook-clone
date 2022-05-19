import { combineReducers } from "redux";
import { friendsAndWannabesReducer } from "./friends-wannabes/slice";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsAndWannabesReducer,
});

export default rootReducer;
