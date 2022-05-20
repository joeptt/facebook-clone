export default function ProfileModal({ onCloseClick, onUpload }) {
    async function onSubmit(event) {
        try {
            event.preventDefault();
            console.log(event.target.image.files[0]);

            const formData = new FormData();
            formData.append("image", event.target.image.files[0]);
            console.log(formData);
            const res = await fetch("/user/uploadImage", {
                method: "POST",
                body: formData,
            });
            console.log("res --> ", res);
            const imgUrl = await res.json();
            console.log("imageUrl -->>>", imgUrl);
            onUpload(imgUrl);
        } catch (err) {
            console.log("error at sending image to server", err);
        }
    }

    function onChange() {
        console.log("changedImage");
    }

    return (
        <div className="modal">
            <button className="close" onClick={onCloseClick}>
                &times;
            </button>
            <div className="modal-content">
                <form className="cover-modal-form" onSubmit={onSubmit}>
                    <label
                        className="button-choosefile"
                        htmlFor="input-profile-modal"
                    >
                        Choose File
                    </label>
                    <input
                        id="input-profile-modal"
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
