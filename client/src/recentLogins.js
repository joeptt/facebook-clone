import { useState, useEffect } from "react";

export default function RecentLogins({ showRegister }) {
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

    async function deleteRecentCookies() {
        const res = await fetch("/delete-cookies");
        const result = await res.json();
        console.log("Result from Deleting Cookies -> ", result);
        if (result.success) {
            console.log("Deleted cookies succesfully");
            location.reload();
        }
    }
    // Write a fetch on click of recent login img to set the req.session.user_id to req.session.recent_id
    ///---------
    async function onClickRecentImage() {
        const res = await fetch("/set-recent-login");
        const result = await res.json();
        console.log("SUCCESS", result);
        if (result.success) {
            console.log("SUCCESS");
            location.reload();
        }
    }

    return (
        <div id="recent-logins">
            <img
                id="facebook-logo"
                src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"
            />

            <h1>Recent Logins</h1>
            <p id="recent-logins-p">Click your picture or add an account. </p>
            {users && (
                <div id="recent-login-profiles">
                    <div className="images-recent-login">
                        <p onClick={deleteRecentCookies} id="x-button-recent">
                            x
                        </p>
                        <img
                            onClick={onClickRecentImage}
                            className="profile-picture-recent"
                            src={
                                users.profile_picture_url
                                    ? users.profile_picture_url
                                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            }
                        />
                        <p id="name-recent">{users.first_name}</p>
                    </div>
                    <div onClick={showRegister} className="images-recent-login">
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
