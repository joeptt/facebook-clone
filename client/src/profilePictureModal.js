export default function ProfileModal({ closeModal, onUpload }) {
    async function onSubmit(event) {
        try {
            event.preventDefault();
            console.log(event.target.image.files[0]);

            const formData = new FormData();
            formData.append("image", event.target.image.files[0]);

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
            <button className="close" onClick={closeModal}>
                &times;
            </button>
            <div className="modal-content">
                <h2>Upload profile picture</h2>
                <form onSubmit={onSubmit}>
                    <input
                        onChange={onChange}
                        type="file"
                        required
                        name="image"
                        accept="image/*"
                    />
                    <button>Upload</button>
                </form>
            </div>
        </div>
    );
}
