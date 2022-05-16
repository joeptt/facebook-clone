import { useState, useEffect } from "react";

export default function Friendships() {
    const [friendLabel, setFriendLabel] = useState("TEST");
    return <button>{friendLabel}</button>;
}
