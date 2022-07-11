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
        setNewPosts([result]);
        e.target.wallpost.value = "";
    }

    return (
        <>
            <form className="form-wall-post" onSubmit={onSubmitWallPost}>
                <img
                    className="input-profile-pic"
                    src={
                        profile_picture_url
                            ? profile_picture_url
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                />
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
                                        src={
                                            profile_picture_url
                                                ? x.profile_picture_url
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                        }
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
