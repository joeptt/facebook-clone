import BioEditor from "./bioEditor";
import ProfileModal from "./profilePictureModal";
import { useState, useEffect } from "react";
import CoverModal from "./coverModal";
import Navbar from "./navbar";

export default function Profile({
    cover_picture_url,
    profile_picture_url,
    first_name,
    last_name,
    onUploadBio,
    bio,
    onUpload,
    onUploadCover,
    onClickLogout,
}) {
    const [modal, setModal] = useState({
        profileModalShown: false,
        coverModalShown: false,
    });

    let [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("mounted");
        fetch(`/get/wallposts`)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setPosts((posts = [...result]));
                console.log("mount posts -> ", posts);
            });
    }, []);
    // show modal
    function onProfileImgClick() {
        setModal({ profileModalShown: true });
    }

    function onClickCoverPhoto() {
        setModal({ coverModalShown: true });
    }

    function onCloseClick() {
        setModal({ profileModalShown: false, coverModalShown: false });
    }
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
                        {modal.coverModalShown && (
                            <CoverModal
                                onUploadCover={onUploadCover}
                                onCloseClick={onCloseClick}
                            />
                        )}
                        {modal.profileModalShown && (
                            <ProfileModal
                                onUpload={onUpload}
                                onCloseClick={onCloseClick}
                            />
                        )}
                        <div className="cover-div">
                            <img
                                src={cover_picture_url}
                                id="cover-photo-profile"
                            />
                            <button
                                id="change-cover-button"
                                onClick={onClickCoverPhoto}
                            >
                                Edit Cover Photo
                            </button>
                        </div>
                        <div className="profile-picture-div">
                            <img
                                src={profile_picture_url}
                                onClick={onProfileImgClick}
                                className="profile-picture-onprofile"
                            ></img>
                            <h3>
                                {first_name} {last_name}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="profile-bottompart">
                    <div className="bio-editior-div">
                        <BioEditor bio={bio} onUploadBio={onUploadBio} />
                    </div>
                    <div className="wall-posts">
                        <div className="all-wall-posts">
                            {posts &&
                                posts.map((x) => {
                                    return (
                                        <div
                                            className="single-wall-post"
                                            key={x.id}
                                        >
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
                    </div>
                </div>
            </div>
        </>
    );
}
