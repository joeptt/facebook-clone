import { useState } from "react";

export default function BioEditor({ bio, onUploadBio }) {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditor = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("Textarea input - > ", event.target.bioArea.value);
        const bio = event.target.bioArea.value;

        const res = await fetch("/user/bio", {
            method: "POST",
            body: JSON.stringify({ bio }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();
        console.log("Result from fetch on bio upload ->", result);

        onUploadBio(result);
        toggleEditor();
    };

    if (isEditing) {
        return (
            <form className="bio-form" onSubmit={onSubmit}>
                <textarea
                    className="bio-textarea"
                    name="bioArea"
                    placeholder={bio ? bio : "Enter bio.."}
                ></textarea>
                <div>
                    <button
                        className="bio-button"
                        onClick={toggleEditor}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button className="bio-button">Send</button>
                </div>
            </form>
        );
    } else {
        return (
            <>
                <div>
                    <p className="bio-text">{bio}</p>
                    <button className="edit-bio-button" onClick={toggleEditor}>
                        Edit Bio
                    </button>
                </div>
            </>
        );
    }
}
