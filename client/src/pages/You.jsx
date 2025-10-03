import React, { useState } from "react";
import { logout } from "../api/api";
import { useAuth } from "../utils/AuthContextProvider";
import { NavLink, Outlet } from "react-router-dom";
import { useModal } from "../utils/ModalContext";

export default function You() {
    const { user, setUser, setIsAuthenticated } = useAuth();
    const [isLogout, setIsLogout] = useState(false);
    const { showModal } = useModal();
    const selectedLinkStyles = {
        color: "#0f0f0f",
        textDecoration: "3px #0f0f0f underline",
        textUnderlineOffset: "8px",
    };
    function confirmLogOut() {
        showModal({
            message: "Are you sure you want to log out?",
            onConfirm: (hideModal) => {
                hideModal();
                handleLogout();
            },
        });
    }
    async function handleLogout() {
        setIsLogout(true);
        try {
            const response = await logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLogout(false);
        }
    }
    return (
        <section className="profilePage">
            <div className="profileView">
                <div className="userImage">
                    <img
                        src={user?.userImage}
                        alt="profile picture"
                        className="profileImg"
                    />
                </div>
                <div className="userInfo">
                    <h2 className="userWelcomeProfile">
                        Welcome, {user?.username}
                    </h2>
                    <h3 className="userEmail">Email: {user?.email}</h3>
                    <p className="accDetailP">
                        Accounted Created On :{" "}
                        {new Date(user?.created_at).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                        {", At "}
                        {new Date(user?.created_at).toLocaleTimeString()}
                    </p>
                    <button
                        className="googleLoginBtn"
                        onClick={() => confirmLogOut()}
                        disabled={isLogout}
                    >
                        <img
                            src="/googleIcon.svg"
                            alt="Google Logo"
                            className="googleSVG"
                        />
                        {isLogout ? "Logging Out..." : "Log Out"}
                    </button>
                </div>
            </div>
            <div className="profileTabsContainer">
                <div className="profileTabLinks">
                    <NavLink
                        to="."
                        end
                        style={({ isActive }) =>
                            isActive ? selectedLinkStyles : null
                        }
                    >
                        Blogs
                    </NavLink>
                    <NavLink
                        to="uploadBlog"
                        style={({ isActive }) =>
                            isActive ? selectedLinkStyles : null
                        }
                    >
                        Upload Blogs
                    </NavLink>
                </div>
            </div>
            <div className="profileTabOutlet">
                <div className="profileTab">
                    <Outlet />
                </div>
            </div>
        </section>
    );
}
