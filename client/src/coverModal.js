export default function ProfileModal({ onCloseClick, onUploadCover }) {
    async function onSubmit(event) {
        event.preventDefault();
        try {
            console.log("coverPhoto ->", event.target.image.files[0]);

            const formData = new FormData();
            formData.append("cover", event.target.image.files[0]);

            const res = await fetch("/user/uploadCoverPhoto", {
                method: "POST",
                body: formData,
            });
            console.log("res --> ", res);
            const imgUrl = await res.json();
            console.log("imageUrl -->>>", imgUrl);
            onUploadCover(imgUrl);
        } catch (err) {
            console.log("error at sending image to server", err);
        }
    }

    function onChange() {
        console.log("changedImage");
    }

    return (
        <div className="cover-modal">
            <button className="close" onClick={onCloseClick}>
                &times;
            </button>
            <div className="modal-content">
                <form className="cover-modal-form" onSubmit={onSubmit}>
                    <label
                        className="button-choosefile"
                        htmlFor="input-cover-modal"
                    >
                        Choose File
                    </label>
                    <input
                        id="input-cover-modal"
                        onChange={onChange}
                        type="file"
                        required
                        name="image"
                        accept="image/*"
                    />
                    <button className="upload-button">Upload</button>
                </form>
            </div>
        </div>
    );
}
