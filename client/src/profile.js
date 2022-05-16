import ProfilePicture from "./profilePicture";
import BioEditor from "./bioEditor";

export default function Profile({
    profile_picture_url,
    first_name,
    last_name,
    onUploadBio,
    bio,
}) {
    return (
        <>
            <h3>
                {first_name} {last_name}
            </h3>
            <ProfilePicture profile_picture_url={profile_picture_url} />
            <BioEditor bio={bio} onUploadBio={onUploadBio} />
        </>
    );
}
