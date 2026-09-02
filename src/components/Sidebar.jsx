import { NavLink } from "react-router-dom";
import { useSidebar } from "./SidebarContext";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* overlay gelap saat sidebar terbuka di mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        <button className="sidebar-close-btn" onClick={closeSidebar}>
          ✕
        </button>

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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                🏠 Dashboard
              </NavLink>

              <NavLink
                to="/murid"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                👨‍🎓 Murid
              </NavLink>

              <NavLink
                to="/tutor"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                👩‍🏫 Tutor
              </NavLink>

              <NavLink
                to="/presensi"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📅 Presensi
              </NavLink>

              <NavLink
                to="/nilai"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📝 Nilai
              </NavLink>

              <NavLink
                to="/pembayaran"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                💰 Pembayaran
              </NavLink>

              <NavLink
                to="/laporan"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📊 Laporan
              </NavLink>
            </>
          )}


          {/* ================= TUTOR ================= */}

          {user?.role === "tutor" && (
            <>
              <NavLink
                to="/tutor"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                🏠 Dashboard
              </NavLink>

              <NavLink
                to="/tutor/murid"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                👨‍🎓 Murid Saya
              </NavLink>

              <NavLink
                to="/presensi"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📅 Presensi
              </NavLink>

              <NavLink
                to="/nilai"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📝 Nilai
              </NavLink>

              <NavLink
                to="/laporan"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📊 Laporan
              </NavLink>
            </>
          )}


          {/* ================= PARENT ================= */}

          {user?.role === "parent" && (
            <>
              <NavLink
                to="/parent"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                🏠 Dashboard
              </NavLink>

              <NavLink
                to="/laporan"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                📊 Laporan Anak
              </NavLink>

              <NavLink
                to="/pembayaran"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
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

          <NavLink
            to="/setting"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            ⚙ Pengaturan
          </NavLink>

          <NavLink
            to="/"
            onClick={() => {
              localStorage.removeItem("user");
              closeSidebar();
            }}
          >
            🚪 Logout
          </NavLink>

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;