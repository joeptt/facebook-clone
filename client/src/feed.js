import FriendsOnly from "./friendsOnly";
import Navbar from "./navbar";
import { useState, useEffect, useRef } from "react";

export default function Feed({ onClickLogout, onClickFriend, user }) {
    const inputPlaceholder = `What's on your mind, ${user.first_name}?`;
    const [newPost, setNewPost] = useState({});
    let [posts, setPosts] = useState([]);
    const refUploaded = useRef();

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
        console.log(e.target.image.files[0], e.target.firstChild.value);

        try {
            const formData = new FormData();

            // If no image provided store the post only
            if (!e.target.image.files[0]) {
                const post = e.target.firstChild.value;
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
            } else {
                // If image provided upload Image aswell as post
                console.log("image provided");
                formData.append("post", e.target.firstChild.value);
                formData.append("postImg", e.target.image.files[0]);
                const res = await fetch("/new-post-image", {
                    method: "POST",
                    body: formData,
                });
                const result = await res.json();
                if (result) {
                    setNewPost(result);
                }
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
                                <input
                                    className="post-text-input"
                                    placeholder={inputPlaceholder}
                                ></input>
                                <div className="break-line-post-input"></div>
                                <div className="image-post-wrapper">
                                    <label
                                        className="label-image-post"
                                        htmlFor="input-post-image"
                                    >
                                        <svg
                                            className="svg-image-post"
                                            fill="#41B45E"
                                            viewBox="0 0 28 28"
                                        >
                                            <g transform="translate(-444 -156)">
                                                <g>
                                                    <path
                                                        d="m96.968 22.425-.648.057a2.692 2.692 0 0 1-1.978-.625 2.69 2.69 0 0 1-.96-1.84L92.01 4.32a2.702 2.702 0 0 1 .79-2.156c.47-.472 1.111-.731 1.774-.79l2.58-.225a.498.498 0 0 1 .507.675 4.189 4.189 0 0 0-.251 1.11L96.017 18.85a4.206 4.206 0 0 0 .977 3.091s.459.364-.026.485m8.524-16.327a1.75 1.75 0 1 1-3.485.305 1.75 1.75 0 0 1 3.485-.305m5.85 3.011a.797.797 0 0 0-1.129-.093l-3.733 3.195a.545.545 0 0 0-.062.765l.837.993a.75.75 0 1 1-1.147.966l-2.502-2.981a.797.797 0 0 0-1.096-.12L99 14.5l-.5 4.25c-.06.674.326 2.19 1 2.25l11.916 1.166c.325.026 1-.039 1.25-.25.252-.21.89-.842.917-1.166l.833-8.084-3.073-3.557z"
                                                        transform="translate(352 156.5)"
                                                    ></path>
                                                    <path
                                                        d="m111.61 22.963-11.604-1.015a2.77 2.77 0 0 1-2.512-2.995L98.88 3.09A2.77 2.77 0 0 1 101.876.58l11.603 1.015a2.77 2.77 0 0 1 2.513 2.994l-1.388 15.862a2.77 2.77 0 0 1-2.994 2.513zm.13-1.494.082.004a1.27 1.27 0 0 0 1.287-1.154l1.388-15.862a1.27 1.27 0 0 0-1.148-1.37l-11.604-1.014a1.27 1.27 0 0 0-1.37 1.15l-1.387 15.86a1.27 1.27 0 0 0 1.149 1.37l11.603 1.016z"
                                                        transform="translate(352 156.5)"
                                                    ></path>
                                                </g>
                                            </g>
                                        </svg>
                                    </label>
                                    <p>Photo</p>
                                    <input
                                        id="input-post-image"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="posts-feed">
                        {posts &&
                            posts.map((post) => {
                                return (
                                    <>
                                        <div
                                            key={post.id}
                                            className="posts-wrapper"
                                        >
                                            <div className="profile-username-wrapper">
                                                <div className="profile-picture-wrapper-posts">
                                                    <img
                                                        className="post-profileImg"
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
                                                {post.post_picture_url && (
                                                    <img
                                                        className="post-image"
                                                        src={
                                                            post.post_picture_url
                                                        }
                                                    ></img>
                                                )}
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
