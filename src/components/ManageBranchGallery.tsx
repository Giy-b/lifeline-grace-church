import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

type ManageBranchGalleryProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
};

export default function ManageBranchGallery({
  selectedBranch,
  setPage,
}: ManageBranchGalleryProps) {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const loadImages = async () => {
    const res = await fetch(
      `${API_BASE_URL}/branch-gallery/${selectedBranch}`
    );

    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const toggleImage = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((x) => x !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const deleteSelected = async () => {
    if (selectedImages.length === 0) {
      alert("Select image(s) first.");
      return;
    }

    if (!window.confirm("Delete selected image(s)?")) return;

    for (const id of selectedImages) {
      await fetch(`${API_BASE_URL}/branch-gallery/${id}`, {
        method: "DELETE",
      });
    }

    setSelectedImages([]);
    loadImages();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#003b8e",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Branch Gallery</h2>

        <button
          onClick={() => setPage("members-dashboard")}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back
        </button>
      </div>

      <div
        style={{
          padding: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => toggleImage(image.id)}
            style={{
              cursor: "pointer",
              border: selectedImages.includes(image.id)
                ? "5px solid red"
                : "3px solid white",
              borderRadius: "15px",
              overflow: "hidden",
              background: "white",
            }}
          >
            <img
              src={`${API_BASE_URL}/uploads/${image.image_path}`}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {selectedImages.includes(image.id)
                ? "✓ Selected"
                : "Click to Select"}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "40px",
        }}
      >
        <button
          onClick={deleteSelected}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🗑 Delete Selected
        </button>
      </div>
    </div>
  );
}