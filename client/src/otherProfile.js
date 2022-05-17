import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import Friendships from "./friendships";

export default function OtherProfile() {
    const { otherUserId } = useParams();
    //const [err, setErr] = useState("");
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        let abort = false;

        fetch(`/api/otherUser/${otherUserId}`)
            .then((res) => res.json())
            .then((user) => {
                if (!abort) {
                    if (user.error === "notFound") {
                        history.push("/");
                    }
                    if (user.error === "ownUser") {
                        history.push("/");
                    }
                    setUser(user);
                    // #3.c the server tells us this is our own profile
                }
            });

        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            <h1>HI i am otherProfile {user.first_name}</h1>
            <img src={user.profile_picture_url}></img>
            <h2>I will display a user picture and the users bio</h2>
            <Friendships otherUserId={otherUserId} />
        </>
    );
}
