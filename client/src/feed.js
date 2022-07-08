import FriendsOnly from "./friendsOnly";
import Navbar from "./navbar";
import { useState, useEffect } from "react";

export default function Feed({ onClickLogout, onClickFriend, user }) {
    const inputPlaceholder = `What's on your mind, ${user.first_name}?`;
    const [newPost, setNewPost] = useState({});
    let [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("/get/posts")
            .then((res) => res.json())
            .then((result) => {
                console.log("result from get", result);
                setPosts((posts = [...result]));
            });
    }, [newPost]);

    const onSubmitNewPost = async (e) => {
        e.preventDefault();
        console.log(e.target.firstChild.value);
        const post = e.target.firstChild.value;
        try {
            const res = await fetch("/new-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post }),
            });
            const result = await res.json();
            if (result) {
                setNewPost(result);
            }
        } catch (error) {
            console.log("Error on posting ->", error);
        }
        e.target.firstChild.value = "";
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
                                <input placeholder={inputPlaceholder}></input>
                            </form>
                        </div>
                    </div>
                    <div className="posts-feed">
                        {posts &&
                            posts.reverse().map((post) => {
                                return (
                                    <>
                                        <div
                                            key={post.id}
                                            className="posts-wrapper"
                                        >
                                            <div className="profile-username-wrapper">
                                                <div className="profile-picture-wrapper-posts">
                                                    <img
                                                        src={
                                                            post.profile_picture_url
                                                                ? post.profile_picture_url
                                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                        }
                                                    />
                                                </div>
                                                <div className="username-createdAt-wrapper">
                                                    <p className="name-posts">
                                                        {post.first_name}{" "}
                                                        {post.last_name}
                                                    </p>
                                                    <p className="created_at-posts">
                                                        {post.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p>{post.post}</p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
                <div id="sidebar-right-homepage">
                    <FriendsOnly onClickFriend={onClickFriend} />
                </div>
            </main>

            <footer></footer>
        </div>
    );
}
