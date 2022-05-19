import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
        };

        this.openEditor = this.openEditor.bind(this);
        this.closeEditor = this.closeEditor.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    openEditor() {
        this.setState({
            isEditing: true,
        });
    }
    closeEditor() {
        this.setState({
            isEditing: false,
        });
    }

    async onSubmit(event) {
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

        this.props.onUploadBio(result);
        this.closeEditor();
    }

    render() {
        if (this.state.isEditing) {
            return (
                <form className="bio-form" onSubmit={this.onSubmit}>
                    <textarea
                        className="bio-textarea"
                        name="bioArea"
                        placeholder="enter bio.."
                    ></textarea>
                    <div>
                        <button
                            className="bio-button"
                            onClick={this.closeEditor}
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
                        <p className="bio-text">{this.props.bio}</p>
                        <button
                            className="edit-bio-button"
                            onClick={this.openEditor}
                        >
                            Edit Bio
                        </button>
                    </div>
                </>
            );
        }
    }
}
