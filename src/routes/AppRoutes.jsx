import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import DashboardAdmin from "../pages/DashboardAdmin";
import DashboardTutor from "../pages/DashboardTutor";
import DashboardParent from "../pages/DashboardParent";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<DashboardAdmin />} />

        <Route path="/tutor" element={<DashboardTutor />} />

        <Route path="/parent" element={<DashboardParent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;