import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import image from "../../images/404.jpg";
function NotFound() {
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowImage(false);
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      {showImage && (
        <img
          src={image}
          alt="Not Found"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {!showImage && <Navigate to="/" />}
    </div>
  );
}

export default NotFound;
