import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const el = useRef(null);

    useEffect(() => {
        function onClick(event) {
            if (!el.current || el.current.contains(event.target)) {
                return;
            }
            setUsers([]);
        }
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, []);

    useEffect(() => {
        let abort = false;
        console.log("Text changed");
        if (!search) {
            setUsers([]);
            return;
        }
        fetch(`/api/find-people?search=${search}`)
            .then((res) => res.json())
            .then((usersData) => {
                if (!abort) {
                    setUsers(usersData);
                }
            });
        return () => (abort = true);
    }, [search]);

    return (
        <div id="search-bar" ref={el}>
            <input
                id="search-input"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Facebook"
            />

            <div id="found-user">
                {users.map((user) => {
                    return (
                        <Link
                            to={`/user/${user.id}`}
                            key={user.id}
                            className="link-found-user"
                        >
                            <div className="users-in-search">
                                <img
                                    src={
                                        user.profile_picture_url
                                            ? user.profile_picture_url
                                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                    }
                                />
                                <h3>
                                    {user.first_name}&nbsp;
                                    {user.last_name}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
