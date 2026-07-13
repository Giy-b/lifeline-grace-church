type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({
  images,
}: ImageGalleryProps) {
  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#0b3d91",
          boxShadow: "0 8px 20px rgba(0,0,0,.35)",
        }}
      >
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt="Church"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Upload Church Image
          </div>
        )}
      </div>
    </div>
  );
}