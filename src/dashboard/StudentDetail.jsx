import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import { getStudentById } from "../data/studentStorage";
import { getReports } from "../data/reportStorage";


function StudentDetail() {

  const { studentId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));


  // =========================
  // DATA MURID & LAPORAN
  // =========================
  // Sekarang diambil dari Firestore

  const [student, setStudent] = useState(null);

  const [reports, setReports] = useState([]);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const loadData = async () => {

      setIsLoading(true);

      try {

        const [studentData, allReports] =
          await Promise.all([
            getStudentById(studentId),
            getReports(),
          ]);

        setStudent(studentData || null);

        setReports(
          allReports.filter(
            (report) =>
              report.studentId === studentId
          )
        );

      } catch (error) {

        console.error(
          "Gagal memuat detail murid:",
          error
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadData();

  }, [studentId]);


  // =========================
  // HITUNG PRESENSI
  // =========================

  const totalAttendance = reports.length;

  const totalPresent = reports.filter(
    (report) => report.attendance === "Hadir"
  ).length;

  const attendance =
    totalAttendance > 0
      ? Math.round(
          (totalPresent / totalAttendance) * 100
        )
      : 0;


  // =========================
  // HITUNG RATA-RATA NILAI
  // =========================
  // Hanya laporan dengan kehadiran "Hadir"
  // yang dihitung (sama seperti Scores.jsx)

  const scoreReports = reports.filter(
    (report) => report.attendance === "Hadir"
  );

  const averageScore =
    scoreReports.length > 0
      ? Math.round(
          scoreReports.reduce(
            (total, report) =>
              total + Number(report.score || 0),
            0
          ) / scoreReports.length
        )
      : 0;


  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="student-detail-page">

          <div className="empty-data">
            Memuat detail murid...
          </div>

        </div>

      </DashboardLayout>

    );

  }


  // Kalau murid tidak ditemukan
  if (!student) {
    return (
      <DashboardLayout>
        <div className="student-detail-page">
          <h2>Murid tidak ditemukan 😢</h2>

          <button onClick={() => navigate("/tutor/murid")}>
            ← Kembali
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Keamanan tambahan:
  // Tutor hanya boleh melihat muridnya sendiri
  if (
    user?.role === "tutor" &&
    student.tutorId !== user.tutorId
  ) {
    return (
      <DashboardLayout>
        <div className="student-detail-page">

          <h2>Akses Ditolak 🔒</h2>

          <p>
            Kamu tidak memiliki akses ke laporan murid ini.
          </p>

          <button
            onClick={() => navigate("/tutor/murid")}
          >
            ← Kembali ke Murid Saya
          </button>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="student-detail-page">

        {/* HEADER */}

        <div className="detail-header">

          <button
            className="back-button"
            onClick={() => navigate("/tutor/murid")}
          >
            ← Kembali
          </button>

          <div>

            <h1>
              Laporan Murid
            </h1>

            <p>
              Detail perkembangan belajar murid
            </p>

          </div>

        </div>


        {/* PROFILE */}

        <div className="student-profile-card">

          <div className="student-avatar">
            👨‍🎓
          </div>

          <div>

            <h2>
              {student.name}
            </h2>

            <p>
              {student.id} • {student.className}
            </p>

            <span className="status-active">
              {student.status || "Aktif"}
            </span>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="student-summary">

          <div className="summary-card">

            <span>📅</span>

            <div>
              <small>Presensi</small>

              <strong>
                {attendance}%
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <span>📝</span>

            <div>
              <small>Rata-rata Nilai</small>

              <strong>
                {averageScore}
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <span>👩‍🏫</span>

            <div>
              <small>Tutor</small>

              <strong>
                {student.tutor}
              </strong>
            </div>

          </div>

        </div>


        {/* ATTENDANCE */}

        <div className="detail-card">

          <h2>
            📅 Presensi
          </h2>

          <div className="progress-wrapper">

            <div className="progress-label">
              <span>Kehadiran</span>

              <strong>
                {attendance}%
              </strong>
            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${attendance}%`
                }}
              />

            </div>

          </div>

        </div>


        {/* SCORE */}

        <div className="detail-card">

          <h2>
            📝 Nilai
          </h2>

          <div className="score-box">

            <strong>
              {averageScore}
            </strong>

            <span>
              Rata-rata nilai
            </span>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default StudentDetail;