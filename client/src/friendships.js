import { useState, useEffect } from "react";

export default function Friendships({ otherUserId }) {
    const [buttonLabel, setButtonLabel] = useState("");

    useEffect(() => {
        fetch(`/friendship-status/${otherUserId}`)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if (result) {
                    if (result.accepted) {
                        setButtonLabel("End Friendship");
                        return;
                    }
                    if (result.error) {
                        setButtonLabel("Add Friend");
                        return;
                    }
                    if (result.recipient_id === +otherUserId) {
                        setButtonLabel("Cancel Request");
                    } else {
                        setButtonLabel("Accept Request");
                    }
                } else {
                    setButtonLabel("Add Friend");
                }
            });
    }, []);

    async function onClickFriendshipButton(e) {
        console.log("clicked friendship button");
        e.preventDefault();
        try {
            const res = await fetch("/friendship-button", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otherUserId,
                    buttonLabel,
                }),
            });
            const result = await res.json();
            if (result.added) {
                setButtonLabel("Cancel Request");
                return;
            }

            if (result.canceled) {
                setButtonLabel("Add Friend");
                return;
            }

            if (result.accepted) {
                setButtonLabel("End Friendship");
                return;
            }

            if (result.ended) {
                setButtonLabel("Add Friend");
                return;
            }
        } catch (error) {
            console.log(
                "error on posting action from friendship button ->",
                error
            );
        }
    }

    return <button onClick={onClickFriendshipButton}>{buttonLabel}</button>;
}
