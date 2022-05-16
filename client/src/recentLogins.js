import { useState, useEffect } from "react";

export default function RecentLogins() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/recentLogins")
            .then((res) => res.json())
            .then((users) => {
                console.log("RECENT FETCHED", users);
                if (users.error === "noUserFound") {
                    return;
                }
                setUsers(users);
            });
    }, []);

    // send a request to route when mounted to see who was logged in last
    // create array of previously logged in people
    // maybe create DB fro them then just limit last 2
    return (
        <div id="recent-logins">
            <img
                id="facebook-logo"
                src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"
            />

            <h1>Recent Logins</h1>
            <p>Click your picture or add an account. </p>
            {users && (
                <div id="recent-login-profiles">
                    <div className="images-recent-login">
                        <img
                            className="profile-picture-recent"
                            src={
                                users.profile_picture_url
                                    ? users.profile_picture_url
                                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            }
                        />
                        <p className="name-recent">{users.first_name}</p>
                    </div>
                    <div className="images-recent-login">
                        <img
                            className="profile-picture-recent"
                            src="https://i.ibb.co/CB3mb17/Bildschirmfoto-2022-05-13-um-18-32-39.png"
                        />
                        <p id="add-new-account" className="name-recent">
                            Add account
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
