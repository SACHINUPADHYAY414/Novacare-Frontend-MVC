import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Nav";
import Loader from "../Loader/Loader";
import { Outlet } from "react-router-dom";
import ChatBot from "../ChatBot/ChatBot";

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [offsetHeight, setOffsetHeight] = useState(0);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const footerHeight = footerRef.current?.offsetHeight || 0;
    setOffsetHeight(headerHeight + footerHeight);
  }, []);

  useEffect(() => {
    window.loadingStart = () => setIsLoading(true);
    window.loadingEnd = () => setIsLoading(false);

    const timeout = setTimeout(() => {
      window.loadingEnd();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      delete window.loadingStart;
      delete window.loadingEnd;
    };
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header ref={headerRef} />

      <main
        style={{
          flexGrow: 1,
          minHeight: "calc(100vh - 200px)",
          position: "relative",
          zIndex: 0
        }}
      >
        {isLoading ? <Loader /> : <Outlet />}
      </main>

      <ChatBot
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999
        }}
      />
    </div>
  );
};

export default Layout;
