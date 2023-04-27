import React, { useState, useEffect } from "react";
import "./ScrollToTop.css";

export default function ScrollToTop() {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={scrollPosition >= window.innerHeight ? "fixed-scroll-top" : ""}
        >
            {scrollPosition > 0 && (
                <i
                    class="fa-solid fa-arrow-up fa-bounce fa-4x cursor"
                    style={{ color: "#72d5ca" }}
                    onClick={handleClick}
                ></i>
            )}
        </div>
    );
}