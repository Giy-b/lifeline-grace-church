import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

type Props = {
  selectedBranch: string;
  setPage: (page: string) => void;

  announcementDepartment: string;
  announcementBackPage: string;
  postedBy: string;
};

function ManageAnnouncements({
  selectedBranch,
  setPage,
  announcementDepartment,
  announcementBackPage,
  postedBy,
}: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const loadAnnouncements = async () => {
    const res = await fetch(`${API_BASE_URL}/announcements`);
    const data = await res.json();
    setAnnouncements(data);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const publishAnnouncement = async () => {
  if (!title || !message) {
    alert("Enter title and announcement.");
    return;
  }

  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      message: message,
     department: announcementDepartment,
      branch: selectedBranch,
      posted_by: postedBy,
    }),
  });

  await response.json();

  if (!response.ok) {
    alert("Error publishing announcement");
    return;
  }

  setTitle("");
  setMessage("");

  loadAnnouncements();

  alert("Announcement Published");
};
  const deleteAnnouncement = async (id: number) => {
    await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
    });

    loadAnnouncements();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        color: "white",
        padding: "30px",
      }}
    >
     <button onClick={() => setPage(announcementBackPage)}>
        ← Back
      </button>

      <h1>📢 Manage Announcements</h1>

      <input
        placeholder="Announcement Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
        }}
      />

      <textarea
        placeholder="Write Announcement..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          marginTop: "10px",
          padding: "10px",
        }}
      />

      <button
        onClick={publishAnnouncement}
        style={{
          marginTop: "15px",
          background: "green",
          color: "white",
          padding: "10px 20px",
          border: "none",
        }}
      >
        Publish
      </button>

      <hr />

      <h2>Published Announcements</h2>

      {announcements
        .filter(
  (a) =>
    a.branch === selectedBranch &&
    a.department === announcementDepartment
)
        .map((a) => (
          <div
            key={a.id}
            style={{
              background: "white",
              color: "black",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{a.title}</h3>

            <p>{a.message}</p>

            <p>
              <strong>Posted By:</strong> {a.posted_by}
            </p>

            <button
              onClick={() => deleteAnnouncement(a.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 15px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default ManageAnnouncements;
