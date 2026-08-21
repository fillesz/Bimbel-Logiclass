import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function StudentDetail() {

  const { studentId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // DATA SEMENTARA
  const [students] = useState([
    {
      id: "LG001",
      name: "Aisyah",
      className: "6 SD",
      tutor: "Kak Bara",
      tutorId: "T001",
      status: "Aktif",
      attendance: 95,
      averageScore: 88,
    },

    {
      id: "LG002",
      name: "Fajar",
      className: "7 SMP",
      tutor: "Kak Rani",
      tutorId: "T002",
      status: "Aktif",
      attendance: 90,
      averageScore: 84,
    },

    {
      id: "LG003",
      name: "Nabila",
      className: "9 SMP",
      tutor: "Kak Bara",
      tutorId: "T001",
      status: "Aktif",
      attendance: 89,
      averageScore: 86,
    },

    {
      id: "LG004",
      name: "Rafa",
      className: "8 SMP",
      tutor: "Kak Rani",
      tutorId: "T002",
      status: "Aktif",
      attendance: 92,
      averageScore: 90,
    },
  ]);

  // Cari murid berdasarkan ID
  const student = students.find(
    (item) => item.id === studentId
  );

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
              {student.status}
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
                {student.attendance}%
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <span>📝</span>

            <div>
              <small>Rata-rata Nilai</small>

              <strong>
                {student.averageScore}
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
                {student.attendance}%
              </strong>
            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${student.attendance}%`
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
              {student.averageScore}
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