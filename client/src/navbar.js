import FindPeople from "./findPeople";

export default function Navbar({ onClickLogout, profile_picture_url }) {
    return (
        <header>
            <nav>Home</nav>
            <div>
                <FindPeople />
            </div>
            <button onClick={onClickLogout}>LOGOUT</button>
            <img src={profile_picture_url} id="profilePictureHeader" />
        </header>
    );
}
