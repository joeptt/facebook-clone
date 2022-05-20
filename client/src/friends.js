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
    last_name,
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
            <div className="wannabes-container">
                <h1>Friend Requests</h1>
                <div className="friend-requests-div">
                    {wannabes &&
                        wannabes.map((item) => {
                            return (
                                <>
                                    <div
                                        className="users-friendship"
                                        key={item.id}
                                    >
                                        <img src={item.profile_picture_url} />
                                        <p>
                                            {item.first_name}&nbsp;
                                            {item.last_name}
                                        </p>
                                        <button
                                            className="accept-friendship-button"
                                            onClick={() =>
                                                onClickAccept(item.id)
                                            }
                                        >
                                            Accept Request
                                        </button>
                                    </div>
                                </>
                            );
                        })}
                </div>
            </div>
            <div className="line-break-friendships"></div>
            <div className="friends-container">
                <h1>Friends</h1>
                <div className="friend-requests-div">
                    {friends &&
                        friends.map((item) => {
                            return (
                                <div className="users-friendship" key={item.id}>
                                    <img src={item.profile_picture_url} />
                                    <p>
                                        {item.first_name}&nbsp;
                                        {item.last_name}
                                    </p>
                                    <button
                                        className="end-friendship-button"
                                        onClick={() => onClickEnd(item.id)}
                                    >
                                        End Friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
