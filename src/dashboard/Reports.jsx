import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

import { studentData } from "../data/studentData";
import { reportData } from "../data/reportData";

import {
  getPackageByStudent,
  getRemainingMeetings,
  getPackageStatus,
  useOneMeeting,
} from "../data/packageStorage";

function Reports() {
  // =========================
  // USER LOGIN
  // =========================
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // DATA MURID (Dinamis dari LocalStorage)
  // =========================
  const [students] = useState(() => {
    const savedStudents =
      localStorage.getItem("students") || localStorage.getItem("studentData");
    return savedStudents ? JSON.parse(savedStudents) : studentData;
  });

  // =========================
  // DATA LAPORAN
  // =========================
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("reports");

    if (savedReports) {
      return JSON.parse(savedReports);
    }

    localStorage.setItem("reports", JSON.stringify(reportData));
    return reportData;
  });

  // =========================
  // FORM
  // =========================
  const [showForm, setShowForm] = useState(false);

  const [newReport, setNewReport] = useState({
    studentId: "",
    date: "",
    subject: "",
    material: "",
    score: "",
    attendance: "Hadir",
    tutorNote: "",
    recommendation: "",
  });

  // =========================
  // PAKET YANG DIPILIH
  // =========================
  const [selectedPackage, setSelectedPackage] = useState(null);

  // =========================
  // MURID YANG BISA DILIHAT
  // =========================
  const visibleStudents = students.filter((student) => {
    // ADMIN
    if (user?.role === "admin") {
      return true;
    }

    // TUTOR
    if (user?.role === "tutor") {
      const tutorNameFromUser = user?.name || user?.nama || "";
      const studentTutor = student.tutor || student.tutorName || "";

      return (
        (user.tutorId && student.tutorId === user.tutorId) ||
        (tutorNameFromUser &&
          studentTutor.toLowerCase() === tutorNameFromUser.toLowerCase())
      );
    }

    // PARENT
    if (user?.role === "parent") {
      return student.id === user.studentId;
    }

    return false;
  });

  // =========================
  // LAPORAN YANG BISA DILIHAT
  // =========================
  const visibleReports = reports.filter((report) => {
    // ADMIN
    if (user?.role === "admin") {
      return true;
    }

    // TUTOR
    if (user?.role === "tutor") {
      return visibleStudents.some(
        (student) => student.id === report.studentId
      );
    }

    // PARENT
    if (user?.role === "parent") {
      return report.studentId === user.studentId;
    }

    return false;
  });

  // =========================
  // CARI DATA MURID
  // =========================
  const getStudent = (studentId) => {
    return students.find((student) => student.id === studentId);
  };

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";
    const parts = date.split("-");
    if (parts.length !== 3) return date;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // =========================
  // TAMBAH LAPORAN
  // =========================
  const handleAddReport = (e) => {
    e.preventDefault();

    // CEK PAKET MURID
    const packageData = getPackageByStudent(newReport.studentId);

    if (!packageData) {
      alert("Murid ini belum memiliki paket aktif.");
      return;
    }

    if (packageData.remaining <= 0) {
      alert(
        "Paket pertemuan murid ini sudah habis. Tutor tidak dapat mengajar sebelum paket diperbarui."
      );
      return;
    }

    // VALIDASI
    if (
      !newReport.studentId ||
      !newReport.date ||
      !newReport.subject.trim() ||
      !newReport.material.trim() ||
      newReport.score === "" ||
      !newReport.tutorNote.trim()
    ) {
      alert("Mohon lengkapi data laporan.");
      return;
    }

    // VALIDASI NILAI
    const score = Number(newReport.score);

    if (isNaN(score) || score < 0 || score > 100) {
      alert("Nilai harus antara 0 sampai 100.");
      return;
    }

    // CEK MURID
    const selectedStudent = visibleStudents.find(
      (student) => student.id === newReport.studentId
    );

    if (!selectedStudent) {
      alert("Murid tidak ditemukan.");
      return;
    }

    // BUAT LAPORAN
    const newReportData = {
      id: "R" + String(reports.length + 1).padStart(3, "0"),
      studentId: newReport.studentId,
      date: newReport.date,
      subject: newReport.subject.trim(),
      material: newReport.material.trim(),
      score: score,
      attendance: newReport.attendance,
      tutorNote: newReport.tutorNote.trim(),
      recommendation: newReport.recommendation.trim(),
    };

    // UPDATE LAPORAN
    const updatedReports = [...reports, newReportData];

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));

    // KURANGI PAKET
    const packageResult = useOneMeeting(newReport.studentId);

    if (!packageResult.success) {
      alert(packageResult.message || "Gagal mengurangi paket.");
      return;
    }

    // RESET FORM
    setNewReport({
      studentId: "",
      date: "",
      subject: "",
      material: "",
      score: "",
      attendance: "Hadir",
      tutorNote: "",
      recommendation: "",
    });

    setSelectedPackage(null);
    setShowForm(false);

    alert(
      "Laporan berhasil ditambahkan dan 1 pertemuan paket telah digunakan."
    );
  };

  // =========================
  // HAPUS LAPORAN
  // =========================
  const handleDeleteReport = (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus laporan ini?"
    );

    if (!confirmDelete) return;

    const updatedReports = reports.filter((report) => report.id !== id);

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  // =========================
  // PARENT
  // =========================
  if (user?.role === "parent") {
    return (
      <DashboardLayout>
        <div className="reports-page">
          <div className="page-header">
            <div>
              <h1>📊 Laporan Anak</h1>
              <p>Pantau perkembangan belajar anak.</p>
            </div>
          </div>

          <div className="report-list">
            {visibleReports.length === 0 ? (
              <div className="empty-data">
                Belum ada laporan untuk anak Anda.
              </div>
            ) : (
              visibleReports.map((report) => {
                const student = getStudent(report.studentId);

                return (
                  <div className="report-card" key={report.id}>
                    <div className="report-card-header">
                      <div>
                        <h2>{report.subject}</h2>
                        <p>
                          {student?.name || student?.nama} {" • "}{" "}
                          {formatDate(report.date)}
                        </p>
                      </div>
                      <strong className="report-score">{report.score}</strong>
                    </div>

                    <div className="report-material">
                      <strong>📚 Materi</strong>
                      <p>{report.material}</p>
                    </div>

                    <div className="report-note">
                      <strong>💬 Catatan Tutor</strong>
                      <p>{report.tutorNote}</p>
                    </div>

                    <div className="report-note">
                      <strong>🎯 Rekomendasi</strong>
                      <p>
                        {report.recommendation || "Tidak ada rekomendasi."}
                      </p>
                    </div>

                    <div className="report-attendance">
                      📅 Kehadiran <strong>{report.attendance}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // ADMIN / TUTOR
  // =========================
  return (
    <DashboardLayout>
      <div className="reports-page">
        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1>📊 Laporan</h1>
            <p>Kelola laporan perkembangan murid.</p>
          </div>

          {user?.role === "tutor" && (
            <button
              className="add-button"
              onClick={() => setShowForm(true)}
            >
              + Tambah Laporan
            </button>
          )}
        </div>

        {/* LIST LAPORAN */}
        <div className="report-list">
          {visibleReports.length === 0 ? (
            <div className="empty-data">Belum ada laporan.</div>
          ) : (
            visibleReports.map((report) => {
              const student = getStudent(report.studentId);

              return (
                <div className="report-card" key={report.id}>
                  <div className="report-card-header">
                    <div>
                      <h2>{report.subject}</h2>
                      <p>
                        {student?.name || student?.nama} {" • "}{" "}
                        {formatDate(report.date)}
                      </p>
                    </div>
                    <strong className="report-score">{report.score}</strong>
                  </div>

                  <div className="report-material">
                    <strong>📚 Materi</strong>
                    <p>{report.material}</p>
                  </div>

                  <div className="report-note">
                    <strong>💬 Catatan Tutor</strong>
                    <p>{report.tutorNote}</p>
                  </div>

                  <div className="report-note">
                    <strong>🎯 Rekomendasi</strong>
                    <p>
                      {report.recommendation || "Tidak ada rekomendasi."}
                    </p>
                  </div>

                  <div className="report-footer">
                    <span>📅 {report.attendance}</span>

                    {user?.role === "tutor" && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Hapus laporan"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL TAMBAH LAPORAN */}
      {showForm && (
        <div className="modal-overlay">
          <div className="student-modal report-modal">
            {/* HEADER MODAL */}
            <div className="modal-header">
              <div>
                <h2>📊 Tambah Laporan</h2>
                <p>Isi perkembangan murid setelah pembelajaran.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddReport}>
              {/* MURID */}
              <label>Murid</label>
              <select
                value={newReport.studentId}
                onChange={(e) => {
                  const studentId = e.target.value;

                  setNewReport({
                    ...newReport,
                    studentId: studentId,
                  });

                  if (studentId) {
                    const packageItem = getPackageByStudent(studentId);
                    setSelectedPackage(packageItem);
                  } else {
                    setSelectedPackage(null);
                  }
                }}
              >
                <option value="">-- Pilih Murid --</option>
                {visibleStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.nama} - {student.className || student.kelas}
                  </option>
                ))}
              </select>

              {/* STATUS PAKET */}
              {selectedPackage && (() => {
                const remaining = getRemainingMeetings(selectedPackage);
                const packageStatus = getPackageStatus(selectedPackage);

                return (
                  <div
                    className={`package-status-box ${packageStatus.className}`}
                  >
                    <div className="package-status-header">
                      <strong>📦 {selectedPackage.packageName}</strong>
                      <span>{packageStatus.label}</span>
                    </div>

                    <div className="package-status-detail">
                      <span>Sisa pertemuan:</span>
                      <strong>{remaining} pertemuan</strong>
                    </div>

                    {!packageStatus.canTeach && (
                      <p className="package-block-message">
                        🚫 Paket sudah habis. Tutor tidak dapat mengajar murid
                        ini sebelum paket diperbarui.
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* TANGGAL */}
              <label>Tanggal</label>
              <input
                type="date"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    date: e.target.value,
                  })
                }
              />

              {/* MAPEL */}
              <label>Mata Pelajaran</label>
              <input
                type="text"
                placeholder="Contoh: Matematika"
                value={newReport.subject}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    subject: e.target.value,
                  })
                }
              />

              {/* MATERI */}
              <label>Materi</label>
              <input
                type="text"
                placeholder="Contoh: Perbandingan"
                value={newReport.material}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    material: e.target.value,
                  })
                }
              />

              {/* NILAI */}
              <label>Nilai</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0 - 100"
                value={newReport.score}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    score: e.target.value,
                  })
                }
              />

              {/* KEHADIRAN */}
              <label>Kehadiran</label>
              <select
                value={newReport.attendance}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    attendance: e.target.value,
                  })
                }
              >
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpa">Alpa</option>
              </select>

              {/* CATATAN TUTOR */}
              <label>Catatan Tutor</label>
              <textarea
                rows="4"
                placeholder="Tuliskan perkembangan belajar murid..."
                value={newReport.tutorNote}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    tutorNote: e.target.value,
                  })
                }
              />

              {/* REKOMENDASI */}
              <label>Rekomendasi</label>
              <textarea
                rows="3"
                placeholder="Contoh: Perbanyak latihan soal cerita."
                value={newReport.recommendation}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    recommendation: e.target.value,
                  })
                }
              />

              {/* BUTTON */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedPackage(null);
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={
                    selectedPackage &&
                    !getPackageStatus(selectedPackage).canTeach
                  }
                >
                  {selectedPackage &&
                  !getPackageStatus(selectedPackage).canTeach
                    ? "Paket Habis"
                    : "Simpan Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Reports;