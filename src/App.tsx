import { API_BASE_URL } from "./config/api";
import { useState, useEffect } from "react";
import DepartmentDashboard from "./components/DepartmentDashboard";
import Home from "./components/Home";
import GroupChat from "./components/GroupChat";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import BishopDashboard from "./pages/BishopDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import MediaDashboard from "./pages/MediaDashboard";
import MembersDashboard from "./components/MembersDashboard";
import ChurchOversight from "./components/ChurchOversight";
import ManageBranchGallery from "./components/ManageBranchGallery";
import ManageHomeGallery from "./components/ManageHomeGallery";
import MemberLogin from "./components/MemberLogin";
import MemberRegistration from "./components/MemberRegistration";
import MembersPortalDashboard from "./components/MembersPortalDashboard";
import AdministrationDashboard from "./pages/AdministrationDashboard";
import CellGroupDashboard from "./pages/CellGroupDashboard";
import PastoralDashboard from "./pages/PastoralDashboard";
import PastoralRecordsPage from "./pages/PastoralRecordsPage";
import DedicationRegister from "./pages/DedicationRegister";
import CanaDashboard from "./components/CanaDashboard";
import BethelDashboard from "./components/BethelDashboard";
import SamariaDashboard from "./components/SamariaDashboard";
import ShalomDashboard from "./components/ShalomDashboard";
import CellGroupPage from "./components/CellGroupPage";
import FinanceDashboard from "./pages/FinanceDashboard";
import LiveStream from "./pages/LiveStream";
import MediaLibrary from "./pages/MediaLibrary";
import YouthDashboard from "./pages/YouthDashboard";
import type { Leader, LoggedInMember } from "./types";

type BranchImage = {
  id: number;
  image_path: string;
};

function App() {
const [loggedInMember, setLoggedInMember] = useState<LoggedInMember | null>(null);
const [isBishopAccess, setIsBishopAccess] = useState(false);
  const [branchImages, setBranchImages] = useState<BranchImage[]>([]);
const [branchImageIndex, setBranchImageIndex] = useState(0);
 const [leaders, setLeaders] = useState<Leader[]>([]);
  const [homeSection, setHomeSection] = useState("home");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isLive, setIsLive] = useState(false);
const [livePlatform, setLivePlatform] = useState("");
const [liveLink, setLiveLink] = useState("");
  const [page, setPage] = useState("home");
  const [memberName, setMemberName] = useState("");
  const [chatUserName, setChatUserName] = useState("");
   const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [showBishopLogin, setShowBishopLogin] = useState(false);
  const [showLeaderLogin, setShowLeaderLogin] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const [bishopUsername, setBishopUsername] = useState("");
  const [bishopPassword, setBishopPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [fade, setFade] = useState(true);
  const [announcementDepartment, setAnnouncementDepartment] = useState("Church");
const [announcementBackPage, setAnnouncementBackPage] = useState("secretary-dashboard");
   const [leaderName, setLeaderName] = useState("");
const [leaderPhone, setLeaderPhone] = useState("");
const [leaderPassword, setLeaderPassword] = useState("");
const [leaderDepartment, setLeaderDepartment] = useState("");
const [leaderRole, setLeaderRole] = useState("");
const [leaderSortBy, setLeaderSortBy] = useState<keyof Leader>("full_name");
const [leaderSearch, setLeaderSearch] = useState("");
  const [chatBackPage, setChatBackPage] = useState("members-portal-dashboard");
const [chatSenderType, setChatSenderType] = useState("Member");
const [chatDepartment, setChatDepartment] = useState("Member");
const [loggedInLeader, setLoggedInLeader] = useState<Leader | null>(null);
const [leadersBackPage, setLeadersBackPage] = useState("bishop-dashboard");
const [membersBackPage, setMembersBackPage] = useState("bishop-dashboard");
 const [selectedDepartment, setSelectedDepartment] = useState("");
const branches = [
    "Bungoma",
    "Ranje",
    "Kimilili",
    "Nairobi",
    "Matunda",
  ];
const churchDepartments = [
  "Administration",
  "Cell Group",
  "Media",
  "Pastoral",
  "Youth",
];
useEffect(() => {
  fetch(`${API_BASE_URL}/home-gallery`)
    .then((res) => res.json())
    .then((data) => {
      setGalleryImages(
        data.map((image: BranchImage) =>
          `${API_BASE_URL}/uploads/${image.image_path}`
        )
      );
      setCurrentImage(0);
    })
    .catch(() => setGalleryImages([]));
}, []);

useEffect(() => {
  if (galleryImages.length < 2) return;

  const interval = setInterval(() => {
    setFade(false);

    setTimeout(() => {
      setCurrentImage(
        (prev) => (prev + 1) % galleryImages.length
      );
      setFade(true);
    }, 500);
  }, 3000);

  return () => clearInterval(interval);
}, [galleryImages]);
useEffect(() => {
  fetch(`${API_BASE_URL}/leaders`)
    .then((res) => res.json())
    .then((data) => setLeaders(data))
    .catch(() => {
      alert("Unable to load leaders.");
    });
}, []);

useEffect(() => {
  fetch(`${API_BASE_URL}/media-library/live-status`)
    .then((res) => res.json())
    .then((data) => {
      setIsLive(Boolean(data.is_live));
      setLivePlatform(data.platform || "");
      setLiveLink(data.link || "");
    })
    .catch(() => {
      setIsLive(false);
      setLivePlatform("");
      setLiveLink("");
    });
}, []);
// ==========================
// LOAD BRANCH IMAGES
// ==========================

useEffect(() => {

  if(selectedBranch){

    fetch(
      `${API_BASE_URL}/branch-gallery/${selectedBranch}`
    )

    .then((res)=>res.json())

    .then((data)=>{

      setBranchImages(data);
      setBranchImageIndex(0);

    })

    .catch(() => {
      setBranchImages([]);
    });

  }

},[selectedBranch]);

// ==========================
// BRANCH IMAGE SLIDER
// ==========================

useEffect(()=>{

  const timer = setInterval(()=>{

    if(branchImages.length > 0){

      setBranchImageIndex(
        (prev)=>
        (prev + 1) % branchImages.length
      );

    }

  },6000);


  return ()=>clearInterval(timer);


},[branchImages]);
const createLeader = async () => {
  const response = await fetch(
    `${API_BASE_URL}/leaders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: leaderName,
        phone: leaderPhone,
        password: leaderPassword,
        role: leaderRole,
        department: leaderDepartment,
        branch: selectedBranch,
      }),
    }
  );

  if (response.ok) {
    alert("Leader Created Successfully");

    const res = await fetch(
      `${API_BASE_URL}/leaders`
    );

    const data = await res.json();

    setLeaders(data);

    setLeaderName("");
    setLeaderPhone("");
    setLeaderPassword("");
    setLeaderDepartment("");
    setLeaderRole("");
  }
};
const deleteLeader = async (id: number) => {
  await fetch(
    `${API_BASE_URL}/leaders/${id}`,
    {
      method: "DELETE",
    }
  );

  const res = await fetch(
    `${API_BASE_URL}/leaders`
  );

  const data = await res.json();

  setLeaders(data);
};
const updateLeader = async () => {
  if (!selectedLeader) {
    alert("Select a leader first");
    return;
  }

  await fetch(
    `${API_BASE_URL}/leaders/${selectedLeader.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: leaderName,
        phone: leaderPhone,
        password: leaderPassword,
        role: leaderRole,
        department: leaderDepartment,
        branch: selectedBranch,
      }),
    }
  );

  const res = await fetch(
    `${API_BASE_URL}/leaders`
  );

  const data = await res.json();

  setLeaders(data);

  alert("Leader Updated");

}
const displayedLeaders = leaders
  .filter((leader) => {
    const search = leaderSearch.toLowerCase();

    return (
      leader.branch === selectedBranch &&
      (
        String(leader.full_name || "").toLowerCase().includes(search) ||
        String(leader.department || "").toLowerCase().includes(search) ||
        String(leader.role || "").toLowerCase().includes(search) ||
        String(leader.phone || "").toLowerCase().includes(search)
      )
    );
  })
  .sort((firstLeader, secondLeader) =>
    String(firstLeader[leaderSortBy] || "").localeCompare(
      String(secondLeader[leaderSortBy] || "")
    )
  );
if (page === "members-portal-dashboard") {
  return (
    <MembersPortalDashboard
      selectedBranch={selectedBranch}
      memberName={memberName}
      loggedInMember={loggedInMember}
      setPage={setPage}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}

if (page === "secretary-dashboard") {
  return (
    <SecretaryDashboard
      selectedBranch={selectedBranch}
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatBackPage={setChatBackPage}
      setChatDepartment={setChatDepartment}
      setAnnouncementDepartment={setAnnouncementDepartment}
      setAnnouncementBackPage={setAnnouncementBackPage}
    />
  );
}

if (page === "pastoral-dashboard") {
  return (
    <PastoralDashboard
      setPage={(nextPage) => {
        if (nextPage === "leaders-management") {
          setLeadersBackPage("pastoral-dashboard");
        }

        if (nextPage === "members-dashboard") {
          setMembersBackPage("pastoral-dashboard");
        }

        setPage(nextPage);
      }}
      loggedInLeader={loggedInLeader}
      setLoggedInLeader={setLoggedInLeader}
      setChatUserName={setChatUserName}
      setChatBackPage={setChatBackPage}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
    />
  );

}
if (page === "baptism-register") {
  return <DedicationRegister setPage={setPage} loggedInLeader={loggedInLeader} />;
}
if (
  page === "member-visitation" ||
  page === "counselling" ||
  page === "prayer-requests"
) {
  return (
    <PastoralRecordsPage
      pageType={page}
      setPage={setPage}
      loggedInLeader={loggedInLeader}
    />
  );
}
if (page === "church-oversight") {
  return (
    <ChurchOversight
      selectedBranch={selectedBranch}
      setPage={setPage}
    />
  );
}
if (page === "member-login") {
  return (
    <MemberLogin
      selectedBranch={selectedBranch}
      setPage={setPage}
      setMemberName={setMemberName}
      setLoggedInMember={setLoggedInMember}
    />
  );
}

if (page === "member-registration") {
  return (
    <MemberRegistration
      selectedBranch={selectedBranch}
      setPage={setPage}
    />
  );
}
if (page === "manage-branch-gallery") {
  return (
    <ManageBranchGallery
      selectedBranch={selectedBranch}
      setPage={setPage}
    />
  );
}
if (page === "manage-home-gallery") {
  return <ManageHomeGallery setPage={setPage} />;
}
if (page === "members-dashboard") {
  return (
    <MembersDashboard
      selectedBranch={selectedBranch}
      setPage={setPage}
      backPage={membersBackPage}
      canManageHomeGallery={membersBackPage === "bishop-dashboard"}
    />
  );
}
if (page === "bishop-dashboard") {
  return (
    <BishopDashboard
      selectedBranch={selectedBranch}
      setPage={(nextPage) => {
        if (nextPage === "leaders-management") {
          setLeadersBackPage("bishop-dashboard");
        }

        if (nextPage === "members-dashboard") {
          setMembersBackPage("bishop-dashboard");
        }

        setPage(nextPage);
      }}
      setBishopUsername={setBishopUsername}
      setBishopPassword={setBishopPassword}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}

if (page === "media-dashboard") {
  return (
    <MediaDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setLoggedInLeader={setLoggedInLeader}
      isBishopAccess={isBishopAccess}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}
if (page === "finance-dashboard") {
  return (
    <FinanceDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}
if (page === "cana-dashboard") {
  return (
    <CanaDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
      setAnnouncementDepartment={setAnnouncementDepartment}
      setAnnouncementBackPage={setAnnouncementBackPage}
    />
  );
}
if (page === "bethel-dashboard") {
  return (
    <BethelDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
      setAnnouncementDepartment={setAnnouncementDepartment}
      setAnnouncementBackPage={setAnnouncementBackPage}
    />
  );
}
if (page === "live-stream") {
  return (
    <LiveStream
  setPage={setPage}
  setIsLive={setIsLive}
  setLivePlatform={setLivePlatform}
  setLiveLink={setLiveLink}
  selectedBranch={selectedBranch}
  loggedInLeader={loggedInLeader}
/>
  );
}
if (page === "media-library-admin") {
  return (
    <MediaLibrary
      selectedBranch={selectedBranch}
      setPage={setPage}
      backPage="media-dashboard"
      mode="admin"
      loggedInLeader={loggedInLeader}
    />
  );
}
if (page === "member-media-library") {
  return (
    <MediaLibrary
      selectedBranch={selectedBranch}
      setPage={setPage}
      backPage="members-portal-dashboard"
      mode="member"
    />
  );
}
if (page === "cell-group-page") {
  return (
   <CellGroupPage
  setPage={setPage}
  memberName={loggedInMember?.full_name || ""}
  branch={selectedBranch}
  cellGroup={loggedInMember?.cell_group || ""}
/>
  );
}
if (page === "samaria-dashboard") {
  return (
    <SamariaDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
      setAnnouncementDepartment={setAnnouncementDepartment}
      setAnnouncementBackPage={setAnnouncementBackPage}
    />
  );
}
if (page === "shalom-dashboard") {
  return (
    <ShalomDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
      setAnnouncementDepartment={setAnnouncementDepartment}
      setAnnouncementBackPage={setAnnouncementBackPage}
    />
  );
}
if (page === "department-dashboard") {
  return (
    <DepartmentDashboard
      selectedBranch={selectedBranch}
      setPage={setPage}
      setIsBishopAccess={setIsBishopAccess}
    />
  );
}
if (page === "group-chat") {
  return (
    <GroupChat
      selectedBranch={selectedBranch}
      memberName={chatUserName}
      senderType={chatSenderType}
      department={chatDepartment}
      setPage={setPage}
      backPage={chatBackPage}
    />
  );
}

if (page === "manage-announcements") {
  return (
    <ManageAnnouncements
      selectedBranch={selectedBranch}
      setPage={setPage}
      announcementDepartment={announcementDepartment}
      announcementBackPage={announcementBackPage}
      postedBy={loggedInLeader?.full_name || "Church Secretary"}
    />
  );
}

if (page === "administration-dashboard") {
  return (
    <AdministrationDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setLoggedInLeader={setLoggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}

if (page === "cell-group-dashboard") {
  return (
    <CellGroupDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setLoggedInLeader={setLoggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}
if (page === "youth-dashboard") {
  return (
    <YouthDashboard
      setPage={setPage}
      loggedInLeader={loggedInLeader}
      setLoggedInLeader={setLoggedInLeader}
      setChatUserName={setChatUserName}
      setChatSenderType={setChatSenderType}
      setChatDepartment={setChatDepartment}
      setChatBackPage={setChatBackPage}
    />
  );
}
if (page === "leaders-management") {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        padding: "20px",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "15px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPage(leadersBackPage)}
          style={{
            background: "#003b8e",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <select
          value={leaderSortBy}
          onChange={(e) => setLeaderSortBy(e.target.value as keyof Leader)}
          style={{
            padding: "10px",
            width: "180px",
          }}
        >
          <option value="full_name">Sort by Name</option>
          <option value="department">Sort by Department</option>
          <option value="role">Sort by Role</option>
        </select>

        <input
          placeholder="Search Leader..."
          value={leaderSearch}
          onChange={(e) => setLeaderSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
          }}
        />
      </div>

      {/* MAIN AREA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70px 500px 1fr",
          gap: "0",
        }}
      >{/* LEFT MENU */}
<div>
  <div
    style={{
      background: "#00008b",
      color: "white",
      padding: "60px 10px",
      fontWeight: "bold",
      textAlign: "center",
      borderBottom: "2px solid green",
      cursor: "pointer",
    }}
  >
    📊 Reports
  </div>

  <div
    onClick={() =>
      selectedLeader &&
      deleteLeader(selectedLeader.id)
    }
    style={{
      background: "#dc2626",
      color: "white",
      padding: "60px 10px",
      fontWeight: "bold",
      textAlign: "center",
      borderBottom: "2px solid green",
      cursor: "pointer",
    }}
  >
    🗑 Delete
  </div>

  <div
    style={{
      background: "#00008b",
      color: "white",
      padding: "60px 10px",
      fontWeight: "bold",
      textAlign: "center",
      cursor: "pointer",
    }}
  >
    ⚙ Settings
  </div>
</div>

        {/* FORM */}
        <div
          style={{
            background: "#eefbe9",
            padding: "20px",
          }}
        >
          <h3>Leader Information</h3>

          <p>Name:</p>
          <input
            value={leaderName}
            onChange={(e) =>
              setLeaderName(e.target.value)
            }
            style={{
              width: "100%",
              height: "50px",
            }}
          />

          <p>Phone Number:</p>
          <input
            value={leaderPhone}
            onChange={(e) =>
              setLeaderPhone(e.target.value)
            }
            style={{
              width: "100%",
              height: "50px",
            }}
          />

          <p>Department:</p>
          <select
            value={leaderDepartment}
            onChange={(e) =>
              setLeaderDepartment(e.target.value)
            }
            style={{
              width: "100%",
              height: "50px",
            }}
          >
            <option value="">
              Select Department
            </option>

            {churchDepartments.map((dept) => (
              <option
                key={dept}
                value={dept}
              >
                {dept}
              </option>
            ))}
          </select>

          <p>Role:</p>
          <input
            value={leaderRole}
            onChange={(e) =>
              setLeaderRole(e.target.value)
            }
            style={{
              width: "100%",
              height: "50px",
            }}
          />

          <p>Password:</p>
          <input
            value={leaderPassword}
            onChange={(e) =>
              setLeaderPassword(e.target.value)
            }
            style={{
              width: "100%",
              height: "50px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={createLeader}
              style={{
                flex: 1,
                background: "green",
                color: "white",
                height: "60px",
              }}
            >
              Add
            </button>

            <button
              onClick={updateLeader}
              style={{
                flex: 1,
                background: "#00008b",
                color: "white",
                height: "60px",
              }}
            >
              Update
            </button>
          </div>
        </div>{/* TABLE */}
<div
  style={{
    background: "#f5f5f5",
    padding: "10px",
    overflowX: "auto",
  }}
>
  <h3
    style={{
      textAlign: "center",
      marginBottom: "15px",
      color: "black",
      fontWeight: "bold",
    }}
  >
    LEADERS DETAILS
  </h3>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      background: "white",
      color: "black",
    }}
  >
    <thead
      style={{
        background: "#003b8e",
        color: "white",
      }}
    >
      <tr>
        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          ID
        </th>

        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          Name
        </th>

        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          Phone
        </th>

        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          Department
        </th>

        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          Role
        </th>

        <th style={{ padding: "10px", border: "1px solid #ccc" }}>
          Password
        </th>
      </tr>
    </thead>

    <tbody>
      {displayedLeaders
        .map((leader) => (
          <tr
            key={leader.id}
            onClick={() => {
              setSelectedLeader(leader);

              setLeaderName(leader.full_name);
              setLeaderPhone(leader.phone);
              setLeaderDepartment(leader.department);
              setLeaderRole(leader.role);
              setLeaderPassword(leader.password);
            }}
            style={{
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.id}
            </td>

            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.full_name}
            </td>

            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.phone}
            </td>

            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.department}
            </td>

            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.role}
            </td>

            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {leader.password}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
          
        </div>
      </div>
    </div>
  );
}
const bishopLogin = async () => {
  const cleanUsername = bishopUsername.trim();

  if (!cleanUsername || !bishopPassword) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bishop-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: cleanUsername,
        password: bishopPassword,
      }),
    });

    const data = await response.json();

    if (data.message === "Login successful") {
      setShowBishopLogin(false);
      setPage("bishop-dashboard");
      setBishopUsername("");
      setBishopPassword("");
    } else {
      alert(data.message);
    }
  } catch {
    alert("Unable to connect to the server.");
  }
};
  // ==========================
  // BRANCH DASHBOARD
  // ==========================
  if (page === "branch-dashboard") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111111",
          color: "white",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <button
          onClick={() => {
            setSelectedBranch("");
            setPage("home");
          }}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to Branches
        </button>

        <h1
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Grace Church - {selectedBranch} Branch
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Welcome to {selectedBranch} Branch Portal
        </p>

        <div
          style={{
            background: "#581c87",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
            }}
          >
            {/* BISHOP PORTAL */}
            <div
              style={{
                background: "white",
                color: "#1e3a8a",
                padding: "25px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <h2>👨‍⚖️ Bishop Portal</h2>

              <p>Full Branch Administration</p>

              <button
                onClick={() => setShowBishopLogin(true)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Enter
              </button>
            </div>

            {/* LEADER PORTAL */}
            <div
              style={{
                background: "white",
                color: "#1e3a8a",
                padding: "25px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <h2>👨‍💼 Leader Portal</h2>

              <p>Department Leaders Access</p>

             <button
            onClick={() => setShowLeaderLogin(true)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Enter
              </button>
            </div>

            {/* MEMBER PORTAL */}
            <div
              style={{
                background: "white",
                color: "#1e3a8a",
                padding: "25px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <h2>👥 Members Portal</h2>

              <p>Sign Up or Login</p>

              <button
               onClick={() => setShowMemberLogin(true)}

                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

     <h2
style={{
textAlign:"center",
marginTop:"40px",
}}
>
{selectedBranch} Gallery
</h2>


<div
style={{
width:"100%",
height:"350px",
background:"#000",
borderRadius:"20px",
overflow:"hidden",
marginTop:"20px",
}}
>

{

branchImages.length > 0 ?



<img

src={
`${API_BASE_URL}/uploads/${branchImages[branchImageIndex].image_path}`
}


style={{

width:"100%",
height:"100%",
objectFit:"cover",
transition:"1s"

}}

/>


:

<h3

style={{
textAlign:"center",
paddingTop:"150px"
}}

>
No images uploaded yet
</h3>


}


</div>

</div>

        {/* BISHOP LOGIN MODAL */}
{showBishopLogin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        color: "black",
        borderRadius: "20px",
        width: "450px",
        maxWidth: "92vw",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          background: "#0d47a1",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
      <h2>👨‍⚖️ Bishop Login</h2>

      <p style={{ margin: "8px 0 0" }}>
        {selectedBranch} Branch
      </p>
      </div>

      <div style={{ padding: "30px" }}>
      <label>Username</label>

      <input
        type="text"
        placeholder="Username"
        value={bishopUsername}
        onChange={(e) => setBishopUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Password"
        value={bishopPassword}
        onChange={(e) => setBishopPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <button
          onClick={bishopLogin}
          style={{
            width: "100%",
            background: "#0d47a1",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          LOGIN
        </button>

        <button
          onClick={() => {
            setShowBishopLogin(false);
            setBishopUsername("");
            setBishopPassword("");
          }}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          CANCEL
        </button>
      </div>
      </div>
    </div>
  </div>
  
)}

{showMemberLogin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <MemberLogin
      selectedBranch={selectedBranch}
      setPage={setPage}
      setMemberName={setMemberName}
      setLoggedInMember={setLoggedInMember}
      isModal
      onCancel={() => setShowMemberLogin(false)}
    />
  </div>
)}

{showLeaderLogin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        width: "450px",
        maxWidth: "92vw",
        background: "white",
        color: "black",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          background: "#0d47a1",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1>LEADER LOGIN</h1>
        <p style={{ margin: "8px 0 0" }}>
          {selectedBranch} Branch
        </p>
      </div>

      <div style={{ padding: "30px" }}>
        <label>Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        >
          <option value="">Select Department</option>
          <option value="Administration">Administration</option>
          <option value="Cell Group">Cell Group</option>
          <option value="Media">Media</option>
          <option value="Pastoral">Pastoral</option>
          <option value="Youth">Youth</option>
        </select>

        <label>Phone Number</label>
        <input
          type="text"
          placeholder="Phone Number"
          value={leaderPhone}
          onChange={(e) => setLeaderPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={leaderPassword}
          onChange={(e) => setLeaderPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={() => {
            const leader = leaders.find(
              (leader) =>
                leader.phone === leaderPhone &&
                leader.password === leaderPassword &&
                leader.department === selectedDepartment &&
                leader.branch === selectedBranch
            );

            if (leader) {
              setLoggedInLeader(leader);

              if (leader.department === "Pastoral") {
                setPage("pastoral-dashboard");
              } else if (leader.department === "Media") {
                setPage("media-dashboard");
              } else if (leader.department === "Administration") {
                if (leader.role === "secretary") {
                  setPage("secretary-dashboard");
                } else if (leader.role === "administrator") {
                  setPage("finance-dashboard");
                } else if (leader.role === "treasurer") {
                  setPage("finance-dashboard");
                }
              } else if (leader.department === "Cell Group") {
                const role = leader.role.trim().toLowerCase();

                if (role === "cana") {
                  setPage("cana-dashboard");
                } else if (role === "bethel") {
                  setPage("bethel-dashboard");
                } else if (role === "samaria") {
                  setPage("samaria-dashboard");
                } else if (role === "shalom") {
                  setPage("shalom-dashboard");
                } else {
                  setPage("cell-group-dashboard");
                }
              } else if (leader.department === "Youth") {
                setPage("youth-dashboard");
              }
            } else {
              alert("Invalid Login");
            }
          }}
          style={{
            width: "100%",
            background: "#0d47a1",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          LOGIN
        </button>

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => setShowLeaderLogin(false)}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    
   </div>
  );
} 
  // ==========================
// LEADER LOGIN
// ==========================
if (page === "leader-login") {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "450px",
          maxWidth: "92vw",
          background: "white",
          color: "black",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            background: "#0d47a1",
            color: "white",
            padding: "20px",
            textAlign: "center",
          }}
        >
      <h1>LEADER LOGIN</h1>
          <p style={{ margin: "8px 0 0" }}>
            {selectedBranch} Branch
          </p>
        </div>

        <div style={{ padding: "30px" }}>
          <label>Department</label>
     <select
  value={selectedDepartment}
  onChange={(e) => setSelectedDepartment(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  }}
>
  <option value="">Select Department</option>
<option value="Administration">Administration</option>
<option value="Cell Group">Cell Group</option>
<option value="Media">Media</option>
<option value="Pastoral">Pastoral</option>
<option value="Youth">Youth</option>
</select>
      <label>Phone Number</label>

      <input
        type="text"
        placeholder="Phone Number"
        value={leaderPhone}
        onChange={(e) =>
          setLeaderPhone(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Password"
        value={leaderPassword}
        onChange={(e) =>
          setLeaderPassword(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

     <button
  onClick={() => {
    const leader = leaders.find(
      (leader) =>
        leader.phone === leaderPhone &&
        leader.password === leaderPassword &&
        leader.department === selectedDepartment &&
        leader.branch === selectedBranch
    );

    if (leader) {
      setLoggedInLeader(leader);

      if (leader.department === "Pastoral") {
        setPage("pastoral-dashboard");

      } else if (leader.department === "Media") {
        setPage("media-dashboard");

      } else if (leader.department === "Administration") {
        if (leader.role === "secretary") {
          setPage("secretary-dashboard");
        } else if (leader.role === "administrator") {
          setPage("finance-dashboard");
        } else if (leader.role === "treasurer") {
          setPage("finance-dashboard");
        }

    } else if (leader.department === "Cell Group") {
  const role = leader.role.trim().toLowerCase();

  if (role === "cana") {
    setPage("cana-dashboard");

  } else if (role === "bethel") {
    setPage("bethel-dashboard");

  } else if (role === "samaria") {
    setPage("samaria-dashboard");

  } else if (role === "shalom") {
    setPage("shalom-dashboard");

  } else {
    setPage("cell-group-dashboard");
  }



} else if (leader.department === "Youth") {
        setPage("youth-dashboard");
      }

    } else {
      alert("Invalid Login");
    }
  }}

        style={{
          width: "100%",
          background: "#0d47a1",
          color: "white",
          border: "none",
          padding: "14px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        LOGIN
      </button>

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => setPage("branch-dashboard")}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          CANCEL
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}


// ==========================
// HOME PAGE
// ==========================
return (
  <Home
  branches={branches}
  homeSection={homeSection}
  setHomeSection={setHomeSection}
  setSelectedBranch={setSelectedBranch}
  setPage={setPage}
  galleryImages={galleryImages}
  currentImage={currentImage}
  fade={fade}
  isLive={isLive}
  livePlatform={livePlatform}
  liveLink={liveLink}
/>
);
}

export default App;
