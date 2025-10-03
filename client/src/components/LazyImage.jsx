import React, { useState } from "react";

export default function LazyImage({
    src,
    alt,
    title,
    containerWidth,
    containerHeight,
    wrapperWidth,
    borderRadius,
    className,
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className="lazyImgContainer"
            style={{
                position: "relative",
                display: "inline-block",
                overflow: "hidden",
                width: wrapperWidth ? wrapperWidth : null,
                maxHeight: containerHeight,
                borderRadius: borderRadius ? borderRadius : "9px",
                backgroundColor: loaded ? "transparent" : "#e0e0e0", // important!
                ...(loaded
                    ? {}
                    : {
                          width: containerWidth ? containerWidth : "100%",
                          height: containerHeight ? containerHeight : "175px",
                      }),
            }}
        >
            {/* Shimmer Skeleton */}
            {!loaded && (
                <div
                    className={className}
                    style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(
                            90deg,
                            #e0e0e0 25%,
                            #f5f5f5 50%,
                            #e0e0e0 75%
                        )`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.2s infinite",
                        borderRadius: "9px",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                />
            )}

            {/* Actual Image */}
            <img
                className={className}
                src={src}
                alt={alt}
                title={title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                style={{
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    transform: loaded ? "scale(1)" : "scale(1.05)",
                    width: containerWidth ? containerWidth : "100%",
                    height: containerHeight ? containerHeight : "auto",
                    objectFit: "cover",
                    position: "relative",
                    zIndex: 2,
                    borderRadius: borderRadius ? borderRadius : "9px",
                    backgroundColor: "transparent", // remove any fallback bg
                }}
            />
        </div>
    );
}
