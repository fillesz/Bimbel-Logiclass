import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { SidebarProvider } from "../components/SidebarContext";

function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="dashboard-layout">

        <Sidebar />

        <div className="main-content">

          <Navbar />

          <div className="page-content">
            {children}
          </div>

        </div>

      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;