export default function ProfilePicture(props) {
    console.log("Props in PP", props);
    return (
        <>
            <img
                onClick={props.onClickImage}
                id="profilePictureHeader"
                src={
                    props.profile_picture_url
                        ? props.profile_picture_url
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
            />
        </>
    );
}
