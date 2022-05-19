// Reducer ------------------------------------------
export function friendsAndWannabesReducer(friendsAndWannabes = [], action) {
    if (action.type === "friendsAndWannabes/received") {
        friendsAndWannabes = [...friendsAndWannabes, ...action.payload.users];
    } else if (action.type === "friendsAndWannabees/unfriended") {
        friendsAndWannabes = friendsAndWannabes.filter((item) => {
            return item.id !== action.payload.user_id;
        });
    } else if (action.type === "friendsAndWannabes/accepted") {
        friendsAndWannabes = friendsAndWannabes.map((item) => {
            if (item.id === action.payload.user_id) {
                const itemCopy = {
                    ...item,
                    accepted: true,
                };
                return itemCopy;
            } else {
                return item;
            }
        });
    }
    return friendsAndWannabes;
}

// ACTION CREATORS -----------------------------------
// Your action creators go here

export function receiveFriendsAndWannabes(users) {
    return {
        type: "friendsAndWannabes/received",
        payload: { users },
    };
}
export function unfriend(user_id) {
    return {
        type: "friendsAndWannabees/unfriended",
        payload: { user_id },
    };
}
export function accept(user_id) {
    return {
        type: "friendsAndWannabes/accepted",
        payload: { user_id },
    };
}
