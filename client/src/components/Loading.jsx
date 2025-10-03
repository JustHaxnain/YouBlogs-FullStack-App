import React from "react";

export default function Loading() {
    return (
        <div className="loadingContainer">
            <img src="/loader.gif" alt="loading gif" />
            <h1 className="loadingText">Loading....</h1>
        </div>
    );
}
