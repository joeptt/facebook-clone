import ProfilePicture from "./profilePicture";
import BioEditor from "./bioEditor";
import CoverPhoto from "./coverPhoto";
import ProfileModal from "./profilePictureModal";
import { useState, useEffect } from "react";

export default function Profile({
    profile_picture_url,
    first_name,
    last_name,
    onUploadBio,
    bio,
    onUpload,
}) {
    const [profileModal, setProfileModal] = useState({ modalShown: false });
    function onProfileImgClick() {
        setProfileModal({ modalShown: true });
    }
    return (
        <div id="profile-page">
            <div id="profile-content">
                <CoverPhoto />
                {profileModal.modalShown && (
                    <ProfileModal onUpload={onUpload} />
                )}
                {/* dont need this ⬇ replace with normal img tag */}
                <ProfilePicture
                    onClick={onProfileImgClick}
                    profile_picture_url={profile_picture_url}
                />
                <h3>
                    {first_name} {last_name}
                </h3>
                <BioEditor bio={bio} onUploadBio={onUploadBio} />
            </div>
        </div>
    );
}
