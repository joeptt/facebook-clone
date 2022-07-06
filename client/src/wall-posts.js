import { useState, useEffect } from "react";

export default function Wallposts({ otherUserId, profile_picture_url }) {
    let [posts, setPosts] = useState([]);
    const [newPosts, setNewPosts] = useState([]);
    useEffect(() => {
        console.log("mounted");
        fetch(`/get/wallposts/${otherUserId}`)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setPosts((posts = [...result]));
                console.log("mount posts -> ", posts);
            });
    }, [newPosts]);

    async function onSubmitWallPost(e) {
        e.preventDefault();
        const post = e.target.wallpost.value;
        const res = await fetch("/wallpost", {
            method: "POST",
            body: JSON.stringify({ post, otherUserId }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        console.log(result);
        setNewPosts([result]);
        e.target.wallpost.value = "";
    }

    return (
        <>
            <form className="form-wall-post" onSubmit={onSubmitWallPost}>
                <img className="input-profile-pic" src={profile_picture_url} />
                <input
                    className="wall-post-input"
                    placeholder="Write something..."
                    name="wallpost"
                ></input>
            </form>
            <div className="all-wall-posts">
                {posts &&
                    posts.map((x) => {
                        return (
                            <div className="single-wall-post" key={x.id}>
                                <div className="upper-wall-post">
                                    <img
                                        className="wall-post-img"
                                        src={x.profile_picture_url}
                                    ></img>
                                    <p className="username">
                                        {x.first_name} {x.last_name}
                                    </p>
                                </div>
                                <p>{x.post}</p>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
