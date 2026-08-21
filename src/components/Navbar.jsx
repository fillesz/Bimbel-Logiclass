function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="navbar">
      <h2>Dashboard</h2>

      <div className="profile">
        🔔
        <span>{user?.name}</span>
      </div>
    </div>
  );
}

export default Navbar;