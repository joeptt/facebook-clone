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
                            <img
                                src={
                                    item.profile_picture_url
                                        ? item.profile_picture_url
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                            />

                            <div className="friends-pchat-wrapper">
                                <p>{item.first_name}</p>
                                <p className="friends-names">
                                    {item.last_name}
                                </p>
                            </div>
                        </div>
                    );
                })}
            <div className="breakline-home-friends"></div>
        </div>
    );
}
