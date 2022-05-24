import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import Navbar from "./navbar";
import Wallposts from "./wall-posts";
import Friendships from "./friendships";

export default function OtherProfile({
    profile_picture_url,
    first_name,
    onClickLogout,
}) {
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
            <Navbar
                onClickLogout={onClickLogout}
                first_name={first_name}
                profile_picture_url={profile_picture_url}
            />

            <div className="profile-whole">
                <div id="profile-page">
                    <div id="profile-content">
                        <div className="cover-div">
                            <img
                                src={
                                    user.cover_picture_url
                                        ? user.cover_picture_url
                                        : "https://images4.alphacoders.com/114/thumb-1920-1141357.jpg"
                                }
                                id="cover-photo-profile"
                            />
                        </div>
                        <div className="profile-picture-div">
                            <img
                                src={user.profile_picture_url}
                                className="profile-picture-onprofile"
                            ></img>
                            <div>
                                <h3>
                                    {user.first_name} {user.last_name}
                                </h3>
                                <Friendships otherUserId={otherUserId} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-bottompart">
                    <div className="bio-editior-div">{user.bio}</div>
                    <div className="wall-posts">
                        <Wallposts
                            otherUserId={otherUserId}
                            profile_picture_url={profile_picture_url}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
