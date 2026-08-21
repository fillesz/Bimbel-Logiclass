import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Admin from "./dashboard/Admin";
import Tutor from "./dashboard/Tutor";
import Parent from "./dashboard/Parent";
import Students from "./dashboard/Students";

import ProtectedRoute from "./auth/ProtectedRoute";

import TutorStudents from "./dashboard/TutorStudents";
import StudentDetail from "./dashboard/StudentDetail";
import Attendance from "./dashboard/Attendance";
import Scores from "./dashboard/Scores";
import Reports from "./dashboard/Reports";
import Payment from "./dashboard/Payment";
import Setting from "./dashboard/Setting";


function App() {

  return (

    <Routes>

      {/* =========================
          LOGIN
      ========================= */}

      <Route
        path="/"
        element={<Login />}
      />


      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">

            <Admin />

          </ProtectedRoute>
        }
      />


      {/* =========================
          TUTOR DASHBOARD
      ========================= */}

      <Route
        path="/tutor"
        element={
          <ProtectedRoute allowedRole="tutor">

            <Tutor />

          </ProtectedRoute>
        }
      />


      {/* =========================
          PARENT DASHBOARD
      ========================= */}

      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRole="parent">

            <Parent />

          </ProtectedRoute>
        }
      />


      {/* =========================
          DATA MURID - ADMIN
      ========================= */}

      <Route
        path="/murid"
        element={
          <ProtectedRoute allowedRole="admin">

            <Students />

          </ProtectedRoute>
        }
      />


      {/* =========================
          MURID SAYA - TUTOR
      ========================= */}

      <Route
        path="/tutor/murid"
        element={
          <ProtectedRoute allowedRole="tutor">

            <TutorStudents />

          </ProtectedRoute>
        }
      />


      {/* =========================
          DETAIL MURID - TUTOR
      ========================= */}

      <Route
        path="/tutor/murid/:studentId"
        element={
          <ProtectedRoute allowedRole="tutor">

            <StudentDetail />

          </ProtectedRoute>
        }
      />


      {/* =========================
          PRESENSI
          ADMIN / TUTOR / PARENT
      ========================= */}

      <Route
        path="/presensi"
        element={
          <ProtectedRoute
            allowedRole={[
              "admin",
              "tutor",
              "parent"
            ]}
          >

            <Attendance />

          </ProtectedRoute>
        }
      />


      {/* =========================
          NILAI
          ADMIN / TUTOR / PARENT
      ========================= */}

      <Route
        path="/nilai"
        element={
          <ProtectedRoute
            allowedRole={[
              "admin",
              "tutor",
              "parent"
            ]}
          >

            <Scores />

          </ProtectedRoute>
        }
      />


      {/* =========================
          LAPORAN
      ========================= */}

      <Route
        path="/laporan"
        element={
          <ProtectedRoute
            allowedRole={[
              "admin",
              "tutor",
              "parent"
            ]}
          >

            <Reports />

          </ProtectedRoute>
        }
      />


      {/* =========================
          PEMBAYARAN / PAKET
          ADMIN / PARENT
      ========================= */}

      <Route
        path="/pembayaran"
        element={
          <ProtectedRoute
            allowedRole={[
              "admin",
              "parent"
            ]}
          >

            <Payment />

          </ProtectedRoute>
        }
      />


      {/* =========================
          SETTING
      ========================= */}

      <Route
        path="/setting"
        element={
          <ProtectedRoute
            allowedRole={[
              "admin",
              "tutor",
              "parent"
            ]}
          >

            <Setting />

          </ProtectedRoute>
        }
      />

    </Routes>

  );

}


export default App;