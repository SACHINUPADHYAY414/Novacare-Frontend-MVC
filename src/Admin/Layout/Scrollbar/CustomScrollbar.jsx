import React, { useRef, useEffect, useState } from "react";
import "./style.css"

const CustomScrollbar = ({ children, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollbarHeight, setScrollbarHeight] = useState(300);
  const [scrollbarTop, setScrollbarTop] = useState(1000);

  const scrollContainerRef = useRef();

  useEffect(() => {
    // const updateScrollbar = () => {
    //   const container = scrollContainerRef.current;
    //   if (!container) return;

    //   const containerHeight = container.clientHeight;
    //   const contentHeight = container.scrollHeight;
    //   const newHeight = (containerHeight / contentHeight) * containerHeight;
    //   const newTop = (container.scrollTop / contentHeight) * containerHeight;
    //   console.log(newHeight,newTop)

    //   setScrollbarHeight(newHeight);
    //   setScrollbarTop(newTop);
    // };


    const updateScrollbar = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
      
        const containerHeight = container.clientHeight;
        const contentHeight = container.scrollHeight;
      
        if (contentHeight > containerHeight) {
          const newHeight = (containerHeight / contentHeight) * containerHeight;
          const newTop = (container.scrollTop / (contentHeight - containerHeight)) * (containerHeight - newHeight);
      
          setScrollbarHeight(newHeight);
          setScrollbarTop(newTop);
        } else {
          // Hide scrollbar if content height is less than container height
          setScrollbarHeight(0);
          setScrollbarTop(0);
        }
      };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollbar);
      updateScrollbar();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollbar);
      }
    };
  }, []);

  return (
    <div
      className={`custom-scroll-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={scrollContainerRef}
      style={{ position: "relative", overflowY: "scroll", height: "100%" }}
    >
      {children}
      <div
        className="custom-scrollbar"
        style={{
          position: "absolute",
          top: scrollbarTop,
          right: isHovered ? 0 : -10,
          width: "8px",
          height: `${scrollbarHeight}px`,
          backgroundColor: "#0AD8B5",
          borderRadius: "4px",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s, right 0.3s",
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
