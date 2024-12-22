// src/pages/NotFound.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const NotFound = () => {
  const navigate = useNavigate();

  // Redirect to homepage after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 seconds delay before navigating

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>
        You will be redirected to the <span>homepage</span> shortly.
      </p>
    </div>
  );
};

export default NotFound;
