import FriendsOnly from "./friendsOnly";
import Navbar from "./navbar";
import { useState } from "react";

export default function Feed({ onClickLogout, onClickFriend, user }) {
    const inputPlaceholder = `What's on your mind, ${user.first_name}?`;
    const [newPost, setNewPost] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setNewPost(value);
    };

    const onSubmitNewPost = (e) => {
        e.preventDefault();

        console.log(newPost);
    };

    return (
        <div className="app">
            <Navbar onClickLogout={onClickLogout} {...user} />

            <main className="container">
                <div id="sidebar-left-homepage"></div>
                <div id="feed-homepage">
                    <div className="input-feed-post">
                        <div className="input-wrapper">
                            <img
                                src={
                                    user.profile_picture_url
                                        ? user.profile_picture_url
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                            />
                            <form onSubmit={onSubmitNewPost}>
                                <input
                                    onChange={handleChange}
                                    placeholder={inputPlaceholder}
                                ></input>
                            </form>
                        </div>
                    </div>
                    <div className="posts-feed">POSTS</div>
                </div>
                <div id="sidebar-right-homepage">
                    <FriendsOnly onClickFriend={onClickFriend} />
                </div>
            </main>

            <footer></footer>
        </div>
    );
}
