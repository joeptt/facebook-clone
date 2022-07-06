import { useState, useEffect } from "react";

export default function FriendsOnly({ onClickFriend }) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetch("/get/friends")
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setFriends([...result]);
            });
    }, []);

    return (
        <div>
            <div className="breakline-home-friends"></div>
            <br></br>
            Contacts
            {friends &&
                friends.map((item) => {
                    return (
                        <div
                            onClick={() => onClickFriend(item.id)}
                            className="home-friends"
                            key={item.id}
                        >
                            <img src={item.profile_picture_url} />
                            <p>
                                {item.first_name}&nbsp;
                                {item.last_name}
                            </p>
                        </div>
                    );
                })}
            <div className="breakline-home-friends"></div>
        </div>
    );
}
