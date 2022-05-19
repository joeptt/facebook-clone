import { useEffect } from "react";
import {
    receiveFriendsAndWannabes,
    unfriend,
    accept,
} from "./redux/friends-wannabes/slice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./navbar";

export default function Friends({
    onClickLogout,
    first_name,
    profile_picture_url,
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        fetch("/friends-and-wannabes")
            .then((res) => res.json())
            .then((result) => {
                dispatch(receiveFriendsAndWannabes(result));
            });
    }, []);

    // Select friends from state array
    const friends = useSelector((state) => {
        return state.friendsAndWannabes.filter(({ accepted }) => accepted);
    });
    // select friend requests from state array
    const wannabes = useSelector((state) => {
        return state.friendsAndWannabes.filter(({ accepted }) => !accepted);
    });

    // end friendship
    function onClickEnd(id) {
        fetch("/friendship-button", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonLabel: "End Friendship",
                otherUserId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("result nach accept", result);
                if (result.ended) {
                    dispatch(unfriend(id));
                }
            });
    }

    //accept friendship
    function onClickAccept(id) {
        fetch("/friendship-button", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonLabel: "Accept Request",
                otherUserId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("result nach accept", result);
                if (result.accepted) {
                    dispatch(accept(id));
                }
            });
    }

    return (
        <>
            <Navbar
                onClickLogout={onClickLogout}
                first_name={first_name}
                profile_picture_url={profile_picture_url}
            />
            <div className="friends-container">
                {friends &&
                    friends.map((item) => {
                        return (
                            <div key={item.id}>
                                <img src={item.profile_picture_url} />
                                <p>{item.first_name}</p>
                                <button onClick={() => onClickEnd(item.id)}>
                                    End Friendship
                                </button>
                            </div>
                        );
                    })}
            </div>
            <div className="wannabes-container">
                {wannabes &&
                    wannabes.map((item) => {
                        return (
                            <div key={item.id}>
                                <img src={item.profile_picture_url} />
                                <p>{item.first_name}</p>
                                <button onClick={() => onClickAccept(item.id)}>
                                    Accept Request
                                </button>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
