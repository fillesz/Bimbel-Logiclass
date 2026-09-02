import { useSidebar } from "./SidebarContext";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { toggleSidebar } = useSidebar();

  return (
    <div className="navbar">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <h2>Dashboard</h2>

      <div className="profile">
        🔔
        <span>{user?.name}</span>
      </div>
    </div>
  );
}

export default Navbar;