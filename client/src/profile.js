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
                            <button onClick={onClickCoverPhoto}>
                                Change Cover Photo
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
                    <div className="wall-posts"></div>
                </div>
            </div>
        </>
    );
}
