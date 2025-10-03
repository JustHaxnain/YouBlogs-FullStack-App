import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const statusCode = error?.status || "Error";
    return (
        <div
            style={{
                minHeight: "calc(80vh - 84px)",
                padding: "0rem 0rem 2rem 0rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                color: "#1a202c",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    fontSize: "6rem",
                    fontWeight: "700",
                    color: "#101218",
                    marginBottom: "1rem",
                }}
            >
                {statusCode}
            </div>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                }}
            >
                Oops! Something went wrong.
            </h1>
            <p
                style={{
                    fontSize: "1.1rem",
                    maxWidth: "500px",
                    color: "#4d4d4d",
                    marginBottom: "2rem",
                }}
            >
                {error?.message && error?.statusText
                    ? `${error.message}, ${error.statusText}.`
                    : "An unexpected error occurred while processing your request."}
            </p>
            <Link
                to="/"
                style={{
                    textDecoration: "none",
                    color: "#1a202c",
                    fontWeight: "500",
                }}
                className="classicBtn"
            >
                ← Back to Home
            </Link>
        </div>
    );
}
