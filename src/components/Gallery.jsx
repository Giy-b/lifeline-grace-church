import { useEffect, useState } from "react";

function Gallery() {
  const images = [
    "/gallery/photo1.jpg",
    "/gallery/photo2.jpg",
    "/gallery/photo3.jpg",
    "/gallery/photo4.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Church Gallery</h2>

      <img
        src={images[current]}
        alt="Church Event"
        style={{
          width: "90%",
          maxWidth: "900px",
          height: "500px",
          objectFit: "cover",
          borderRadius: "20px",
        }}
      />
    </div>
  );
}

export default Gallery;