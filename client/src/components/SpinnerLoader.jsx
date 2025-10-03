import React from "react";

export default function SpinnerLoader({ width }) {
    return (
        <div
            class="loader"
            style={{
                height: width,
                width: width,
            }}
        ></div>
    );
}
