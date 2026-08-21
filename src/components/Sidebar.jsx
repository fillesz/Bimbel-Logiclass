import { NavLink } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside className="sidebar">

      <h2 className="logo">
        📚 LOGICLASS
      </h2>

      <p className="sidebar-title">
        MAIN
      </p>

      <nav>

        {/* ================= ADMIN ================= */}

        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/murid"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              👨‍🎓 Murid
            </NavLink>

            <NavLink
              to="/tutor"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              👩‍🏫 Tutor
            </NavLink>

            <NavLink to="/presensi">
              📅 Presensi
            </NavLink>

            <NavLink to="/nilai">
              📝 Nilai
            </NavLink>

            <NavLink to="/pembayaran">
              💰 Pembayaran
            </NavLink>

            <NavLink to="/laporan">
              📊 Laporan
            </NavLink>
          </>
        )}


        {/* ================= TUTOR ================= */}

        {user?.role === "tutor" && (
          <>
            <NavLink
              to="/tutor"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/tutor/murid"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              👨‍🎓 Murid Saya
            </NavLink>

            <NavLink to="/presensi">
              📅 Presensi
            </NavLink>

            <NavLink to="/nilai">
              📝 Nilai
            </NavLink>

            <NavLink to="/laporan">
              📊 Laporan
            </NavLink>
          </>
        )}


        {/* ================= PARENT ================= */}

        {user?.role === "parent" && (
          <>
            <NavLink
              to="/parent"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              🏠 Dashboard
            </NavLink>

            <NavLink to="/laporan">
              📊 Laporan Anak
            </NavLink>

            <NavLink to="/pembayaran">
              💰 Pembayaran
            </NavLink>
          </>
        )}

      </nav>


      {/* ================= SYSTEM ================= */}

      <p className="sidebar-title">
        SYSTEM
      </p>

      <nav>

        <NavLink to="/setting">
          ⚙ Pengaturan
        </NavLink>

        <NavLink
          to="/"
          onClick={() => localStorage.removeItem("user")}
        >
          🚪 Logout
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;