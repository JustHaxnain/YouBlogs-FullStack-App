import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleOAuth, getUser } from "../api/api";
import { useAuth } from "../utils/AuthContextProvider";

export default function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { setUser, setIsAuthenticated } = useAuth();
    async function responseGoogle(credentials) {
        try {
            setIsLoggingIn(true);
            const credentialsResponse = await googleOAuth(credentials.code);
            const userResponse = await getUser();
            setUser(userResponse.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoggingIn(false);
        }
    }
    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onError: responseGoogle,
        onSuccess: responseGoogle,
    });
    return (
        <section className="loginPageSection">
            <div className="logInCard">
                <h1 className="loginPageHeading">Sign / Log in</h1>
                <div className="loginDescription">
                    <div className="DesOne">
                        <p className="loginPageDesc">
                            Sign in to YouBlogs with Google.
                        </p>
                        <p className="loginPageDesc">
                            Join the conversation, follow your favorite
                            creators, and share your own voice.
                        </p>
                    </div>
                    <div className="descTwo">
                        <p className="loginPageDesc">
                            With an account, you can:
                        </p>
                        <p className="loginPageDesc">
                            ✅ Publish your own blogs and stories
                        </p>
                        <p className="loginPageDesc">
                            ✅ Like and comment on posts
                        </p>
                        <p className="loginPageDesc">
                            ✅ Save your favorite content for later
                        </p>
                    </div>
                    <div className="descThree">
                        <p className="loginPageDesc">
                            It's fast, free, and takes only a moment.
                        </p>
                    </div>
                </div>
                <button
                    onClick={googleLogin}
                    className="googleLoginBtn"
                    disabled={isLoggingIn}
                >
                    <img
                        src="/googleIcon.svg"
                        alt="Google Logo"
                        className="googleSVG"
                    />
                    {isLoggingIn ? "Signing in...." : "Sign in With Google"}
                </button>
            </div>
        </section>
    );
}
