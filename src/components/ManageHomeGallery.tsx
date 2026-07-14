import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

type HomeImage = {
  id: number;
  image_name: string;
  image_path: string;
};

type ManageHomeGalleryProps = {
  setPage: (page: string) => void;
};

export default function ManageHomeGallery({ setPage }: ManageHomeGalleryProps) {
  const [images, setImages] = useState<HomeImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const loadImages = async () => {
    const response = await fetch(`${API_BASE_URL}/home-gallery`);
    setImages(await response.json());
  };

  useEffect(() => {
    loadImages();
  }, []);

  const toggleImage = (id: number) => {
    setSelectedImages((selected) =>
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedImages.length === 0) {
      alert("Select image(s) first.");
      return;
    }

    if (!window.confirm("Delete selected home gallery image(s)?")) return;

    await Promise.all(
      selectedImages.map((id) =>
        fetch(`${API_BASE_URL}/home-gallery/${id}`, { method: "DELETE" })
      )
    );
    setSelectedImages([]);
    loadImages();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#14532d", color: "white" }}>
      <div style={{ background: "#003b8e", padding: "20px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Home Gallery</h2>
        <button onClick={() => setPage("members-dashboard")} style={buttonStyle("#dc2626")}>
          Back
        </button>
      </div>

      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => toggleImage(image.id)}
            style={{
              cursor: "pointer",
              border: selectedImages.includes(image.id) ? "5px solid #dc2626" : "3px solid white",
              borderRadius: "8px",
              overflow: "hidden",
              background: "white",
              padding: 0,
              textAlign: "left",
            }}
          >
            <img src={`${API_BASE_URL}/uploads/${image.image_path}`} alt={image.image_name} style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
            <span style={{ display: "block", padding: "12px", textAlign: "center", color: "#111827", fontWeight: "bold" }}>
              {selectedImages.includes(image.id) ? "Selected" : "Click to select"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", paddingBottom: "40px" }}>
        <button onClick={deleteSelected} style={buttonStyle("#dc2626")}>
          Delete Selected
        </button>
      </div>
    </div>
  );
}

const buttonStyle = (background: string) => ({
  background,
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
});
