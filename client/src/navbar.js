import FindPeople from "./findPeople";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({
    onClickLogout,
    profile_picture_url,
    first_name,
}) {
    const [dropDownShown, setDropDownShown] = useState({
        dropDownShown: false,
    });

    function onClickArrow() {
        if (dropDownShown.dropDownShown === false) {
            setDropDownShown({ dropDownShown: true });
        } else {
            setDropDownShown({ dropDownShown: false });
        }
    }

    return (
        <>
            <header>
                <div className="header-divs-search">
                    <Link to="/" id="link-to-home">
                        <img
                            className="facebook-icon-navbar"
                            src="https://i.ibb.co/16p0sWF/f-logo-RGB-Blue-512.png"
                        />
                    </Link>

                    <FindPeople />
                </div>
                <div className="header-divs-icons">
                    <Link className="icons" to="/">
                        <div className="icons">
                            <svg className="icon-navbar" viewBox="0 0 28 28">
                                <path
                                    d="
                            M17.5 23.979 21.25 23.979C21.386 23.979 21.5 23.864
                            21.5 23.729L21.5 13.979C21.5 13.427 21.949 12.979
                            22.5 12.979L24.33 12.979 14.017 4.046 3.672 12.979
                            5.5 12.979C6.052 12.979 6.5 13.427 6.5 13.979L6.5
                            23.729C6.5 23.864 6.615 23.979 6.75 23.979L10.5
                            23.979 10.5 17.729C10.5 17.04 11.061 16.479 11.75
                            16.479L16.25 16.479C16.939 16.479 17.5 17.04 17.5
                            17.729L17.5 23.979ZM21.25 25.479 17 25.479C16.448
                            25.479 16 25.031 16 24.479L16 18.327C16 18.135
                            15.844 17.979 15.652 17.979L12.348 17.979C12.156
                            17.979 12 18.135 12 18.327L12 24.479C12 25.031
                            11.552 25.479 11 25.479L6.75 25.479C5.784 25.479 5
                            24.695 5 23.729L5 14.479 3.069 14.479C2.567 14.479
                            2.079 14.215 1.868 13.759 1.63 13.245 1.757 12.658
                            2.175 12.29L13.001 2.912C13.248 2.675 13.608 2.527
                            13.989 2.521 14.392 2.527 14.753 2.675 15.027
                            2.937L25.821 12.286C25.823 12.288 25.824 12.289
                            25.825 12.29 26.244 12.658 26.371 13.245 26.133
                            13.759 25.921 14.215 25.434 14.479 24.931 14.479L23
                            14.479 23 23.729C23 24.695 22.217 25.479 21.25
                            25.479Z"
                                ></path>
                            </svg>
                        </div>
                    </Link>
                    <Link to="/friends" className="icons">
                        <div className="icons">
                            <svg className="icon-navbar" viewBox="0 0 28 28">
                                <path
                                    d="
                            M10.5 4.5c-2.272 0-2.75 1.768-2.75 3.25C7.75 9.542 8.983 11 10.5 11s2.75-1.458 2.75-3.25c0-1.482-.478-3.25-2.75-3.25zm0 8c-2.344 0-4.25-2.131-4.25-4.75C6.25 4.776 7.839 3 10.5 3s4.25 1.776 4.25 4.75c0 2.619-1.906 4.75-4.25 4.75zm9.5-6c-1.41 0-2.125.841-2.125 2.5 0 1.378.953 2.5 2.125 2.5 1.172 0 2.125-1.122 2.125-2.5 0-1.659-.715-2.5-2.125-2.5zm0 6.5c-1.999 0-3.625-1.794-3.625-4 0-2.467 1.389-4 3.625-4 2.236 0 3.625 1.533 3.625 4 0 2.206-1.626 4-3.625 4zm4.622 8a.887.887 0 00.878-.894c0-2.54-2.043-4.606-4.555-4.606h-1.86c-.643 0-1.265.148-1.844.413a6.226 6.226 0 011.76 4.336V21h5.621zm-7.122.562v-1.313a4.755 4.755 0 00-4.749-4.749H8.25A4.755 4.755 0 003.5 20.249v1.313c0 .518.421.938.937.938h12.125c.517 0 .938-.42.938-.938zM20.945 14C24.285 14 27 16.739 27 20.106a2.388 2.388 0 01-2.378 2.394h-5.81a2.44 2.44 0 01-2.25 1.5H4.437A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.25 14h4.501a6.2 6.2 0 013.218.902A5.932 5.932 0 0119.084 14h1.861z"
                                ></path>
                            </svg>
                        </div>
                    </Link>
                    <div className="icons">
                        <svg className="icon-navbar" viewBox="0 0 28 28">
                            <path
                                d="
                            M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z"
                            ></path>
                        </svg>
                    </div>
                </div>
                <div className="header-divs-logout">
                    <Link to="/profile" className="profile-image-name">
                        <div className="profile-image-name">
                            <img
                                src={profile_picture_url}
                                id="profilePictureHeader"
                            />
                            <p id="name-navbar">{first_name}</p>
                        </div>
                    </Link>
                    <div className="icon-notification">
                        <svg
                            className="icon-notification-svg"
                            viewBox="0 0 28 28"
                        >
                            <path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path>
                        </svg>
                    </div>
                    <div className="icon-menu" onClick={onClickArrow}>
                        <svg className="icon-menu-svg" viewBox="0 0 20 20">
                            <path d="M10 14a1 1 0 0 1-.755-.349L5.329 9.182a1.367 1.367 0 0 1-.205-1.46A1.184 1.184 0 0 1 6.2 7h7.6a1.18 1.18 0 0 1 1.074.721 1.357 1.357 0 0 1-.2 1.457l-3.918 4.473A1 1 0 0 1 10 14z"></path>
                        </svg>
                    </div>
                </div>
            </header>
            {dropDownShown.dropDownShown && (
                <div className="drop-down">
                    <div>
                        <button
                            className="log-out-button"
                            onClick={onClickLogout}
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
