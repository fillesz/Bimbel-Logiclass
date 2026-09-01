import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

import { getStudents } from "../data/studentStorage";
import { reportData } from "../data/reportData";

import {
  getPackageByStudent,
  getPackageStatus,
  useOneMeeting,
} from "../data/packageStorage";


// =========================
// GRAFIK NILAI (SVG, tanpa library tambahan)
// =========================

function ScoreChart({ reports }) {

  // Urutkan dari yang paling lama ke paling baru
  // (biar garis grafiknya jalan maju sesuai waktu)

  const chronological =
    [...reports].sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );

  if (chronological.length === 0) {

    return null;

  }

  const width = 600;
  const height = 200;
  const padding = 32;

  const scores = chronological.map(
    (report) => Number(report.score)
  );

  const maxScore = 100;
  const minScore = 0;

  const points = chronological.map(
    (report, index) => {

      const x =
        chronological.length === 1
          ? width / 2
          : padding +
            (index /
              (chronological.length - 1)) *
              (width - padding * 2);

      const y =
        height -
        padding -
        ((Number(report.score) - minScore) /
          (maxScore - minScore)) *
          (height - padding * 2);

      return { x, y, report };

    }
  );

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const average = Math.round(
    scores.reduce(
      (total, score) => total + score,
      0
    ) / scores.length
  );

  return (

    <div className="report-chart-card">

      <div className="report-chart-header">

        <strong>
          📈 Grafik Nilai
        </strong>

        <span>
          Rata-rata: {average}
        </span>

      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
      >

        {/* garis bantu horizontal */}

        {[0, 25, 50, 75, 100].map(
          (gridScore) => {

            const y =
              height -
              padding -
              (gridScore / 100) *
                (height - padding * 2);

            return (

              <g key={gridScore}>

                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                />

                <text
                  x={4}
                  y={y + 4}
                  fontSize="10"
                  fill="#999"
                >
                  {gridScore}
                </text>

              </g>

            );

          }
        )}

        {/* garis nilai */}

        <path
          d={linePath}
          fill="none"
          stroke="#f5a623"
          strokeWidth="2"
        />

        {/* titik + label tanggal */}

        {points.map((point, index) => (

          <g key={index}>

            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#f5a623"
            />

            <text
              x={point.x}
              y={height - 8}
              fontSize="9"
              fill="#999"
              textAnchor="middle"
            >

              {point.report.date
                ? point.report.date
                    .split("-")
                    .slice(1)
                    .reverse()
                    .join("/")
                : ""}

            </text>

          </g>

        ))}

      </svg>

    </div>

  );

}


function Reports() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID
  // =========================

  const students = getStudents();


  // =========================
  // DATA LAPORAN
  // =========================

  const [reports, setReports] = useState(() => {

    const savedReports =
      localStorage.getItem("reports");

    if (savedReports) {

      try {

        return JSON.parse(
          savedReports
        );

      } catch (error) {

        console.error(
          "Data laporan rusak:",
          error
        );

      }

    }

    localStorage.setItem(
      "reports",
      JSON.stringify(reportData)
    );

    return reportData;

  });


  // =========================
  // FORM
  // =========================

  const [showForm, setShowForm] =
    useState(false);


  const [newReport, setNewReport] =
    useState({

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
  // MURID YANG BISA DILIHAT
  // =========================

  const visibleStudents =
    students.filter((student) => {


      // ADMIN
      if (user?.role === "admin") {

        return true;

      }


      // TUTOR
      if (user?.role === "tutor") {

        return (
          student.tutorId ===
          user.tutorId
        );

      }


      // PARENT
      if (user?.role === "parent") {

        return (
          student.id ===
          user.studentId
        );

      }


      return false;

    });


  // =========================
  // LAPORAN YANG BISA DILIHAT
  // =========================

  const visibleReports =
    reports.filter((report) => {


      // ADMIN
      if (user?.role === "admin") {

        return true;

      }


      // TUTOR
      if (user?.role === "tutor") {

        return visibleStudents.some(
          (student) =>
            student.id ===
            report.studentId
        );

      }


      // PARENT
      if (user?.role === "parent") {

        return (
          report.studentId ===
          user.studentId
        );

      }


      return false;

    });


  // =========================
  // LAPORAN TERBARU DI ATAS
  // =========================

  const sortedReports =
    [...visibleReports].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


  // =========================
  // CARI DATA MURID
  // =========================

  const getStudent = (studentId) => {

    return students.find(
      (student) =>
        student.id === studentId
    );

  };


  // =========================
  // FORMAT TANGGAL
  // =========================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    const parts =
      date.split("-");


    if (parts.length !== 3) {

      return date;

    }


    return `${parts[2]}-${parts[1]}-${parts[0]}`;

  };


  // =========================
  // TAMBAH LAPORAN
  // =========================

  const handleAddReport = (e) => {

    e.preventDefault();


    // =========================
    // VALIDASI DASAR
    // =========================

    if (
      !newReport.studentId ||
      !newReport.date ||
      !newReport.subject.trim() ||
      !newReport.material.trim() ||
      newReport.score === "" ||
      !newReport.tutorNote.trim()
    ) {

      alert(
        "Mohon lengkapi data laporan."
      );

      return;

    }


    // =========================
    // VALIDASI NILAI
    // =========================

    const score =
      Number(newReport.score);


    if (
      isNaN(score) ||
      score < 0 ||
      score > 100
    ) {

      alert(
        "Nilai harus antara 0 sampai 100."
      );

      return;

    }


    // =========================
    // CEK MURID
    // =========================

    const selectedStudent =
      visibleStudents.find(
        (student) =>
          student.id ===
          newReport.studentId
      );


    if (!selectedStudent) {

      alert(
        "Murid tidak ditemukan."
      );

      return;

    }


    // =========================
    // CEK PAKET
    // =========================

    const studentPackage =
      getPackageByStudent(
        newReport.studentId
      );


    // Kalau tidak ada paket
    if (!studentPackage) {

      alert(
        `Paket ${selectedStudent.name} belum tersedia.\n\nTutor tidak dapat membuat laporan sebelum murid memiliki paket belajar.`
      );

      return;

    }


    // =========================
    // CEK STATUS PAKET
    // =========================

    const packageStatus =
      getPackageStatus(
        studentPackage
      );


    // Paket habis
    if (
      !packageStatus.canTeach
    ) {

      alert(
        `Paket ${selectedStudent.name} sudah habis.\n\nTutor tidak dapat mengajar sebelum orang tua melakukan pembayaran paket baru.`
      );

      return;

    }


    // =========================
    // BUAT DATA LAPORAN
    // =========================

    const newReportData = {

      id:
        "R" +
        String(
          reports.length + 1
        ).padStart(3, "0"),

      studentId:
        newReport.studentId,

      date:
        newReport.date,

      subject:
        newReport.subject.trim(),

      material:
        newReport.material.trim(),

      score:
        score,

      attendance:
        newReport.attendance,

      tutorNote:
        newReport.tutorNote.trim(),

      recommendation:
        newReport.recommendation.trim(),

    };


    // =========================
    // UPDATE LAPORAN
    // =========================

    const updatedReports = [

      ...reports,

      newReportData,

    ];


    // =========================
    // PAKET BERKURANG
    // =========================
    //
    // Hanya dikurangi kalau
    // pembelajaran benar-benar berlangsung.
    //
    // Hadir = paket berkurang
    // Izin  = tidak berkurang
    // Sakit = tidak berkurang
    // Alpa  = tidak berkurang
    //

    if (
      newReport.attendance ===
      "Hadir"
    ) {

      const packageResult =
        useOneMeeting(
          newReport.studentId
        );


      // Kalau gagal mengurangi paket
      if (!packageResult.success) {

        alert(
          packageResult.message
        );

        return;

      }

    }


    // =========================
    // SIMPAN LAPORAN
    // =========================

    setReports(
      updatedReports
    );


    localStorage.setItem(
      "reports",
      JSON.stringify(
        updatedReports
      )
    );


    // =========================
    // RESET FORM
    // =========================

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


    setShowForm(false);


    // =========================
    // PESAN BERHASIL
    // =========================

    if (
      newReport.attendance ===
      "Hadir"
    ) {

      const updatedPackage =
        getPackageByStudent(
          newReport.studentId
        );


      const remaining =
        updatedPackage
          ? Math.max(
              updatedPackage.totalMeetings -
                updatedPackage.usedMeetings,
              0
            )
          : 0;


      alert(
        `Laporan berhasil ditambahkan.\n\nSisa paket ${selectedStudent.name}: ${remaining} pertemuan.`
      );

    } else {

      alert(
        "Laporan berhasil ditambahkan.\n\nKarena murid tidak hadir, paket tidak dikurangi."
      );

    }

  };


  // =========================
  // HAPUS LAPORAN
  // =========================

  const handleDeleteReport = (id) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus laporan ini?"
      );


    if (!confirmDelete) {

      return;

    }


    const updatedReports =
      reports.filter(
        (report) =>
          report.id !== id
      );


    setReports(
      updatedReports
    );


    localStorage.setItem(
      "reports",
      JSON.stringify(
        updatedReports
      )
    );

  };


  // =========================
  // PARENT
  // =========================

  if (user?.role === "parent") {

    return (

      <DashboardLayout>

        <div className="reports-page">

          {/* HEADER */}

          <div className="page-header">

            <div>

              <h1>
                📊 Laporan Anak
              </h1>

              <p>
                Pantau perkembangan belajar anak.
              </p>

            </div>

          </div>


          {/* GRAFIK NILAI */}

          <ScoreChart
            reports={sortedReports}
          />


          {/* LIST LAPORAN */}

          <div className="report-list">

            {sortedReports.length === 0 ? (

              <div className="empty-data">

                Belum ada laporan
                untuk anak Anda.

              </div>

            ) : (

              sortedReports.map(
                (report) => {

                  const student =
                    getStudent(
                      report.studentId
                    );


                  return (

                    <div
                      className="report-card"
                      key={report.id}
                    >

                      {/* HEADER CARD */}

                      <div className="report-card-header">

                        <div>

                          <h2>
                            {report.subject}
                          </h2>

                          <p>

                            {student?.name}

                            {" • "}

                            {formatDate(
                              report.date
                            )}

                          </p>

                        </div>


                        <strong
                          className="report-score"
                        >
                          {report.score}
                        </strong>

                      </div>


                      {/* MATERI */}

                      <div className="report-material">

                        <strong>
                          📚 Materi
                        </strong>

                        <p>
                          {report.material}
                        </p>

                      </div>


                      {/* CATATAN */}

                      <div className="report-note">

                        <strong>
                          💬 Catatan Tutor
                        </strong>

                        <p>
                          {report.tutorNote}
                        </p>

                      </div>


                      {/* REKOMENDASI */}

                      <div className="report-note">

                        <strong>
                          🎯 Rekomendasi
                        </strong>

                        <p>

                          {report.recommendation ||
                            "Tidak ada rekomendasi."}

                        </p>

                      </div>


                      {/* KEHADIRAN */}

                      <div className="report-attendance">

                        📅 Kehadiran{" "}

                        <strong>
                          {report.attendance}
                        </strong>

                      </div>

                    </div>

                  );

                }
              )

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


        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              📊 Laporan
            </h1>

            <p>
              Kelola laporan perkembangan murid.
            </p>

          </div>


          {/* TOMBOL TAMBAH */}

          {user?.role === "tutor" && (

            <button
              className="add-button"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Tambah Laporan
            </button>

          )}

        </div>


        {/* =========================
            LIST LAPORAN
        ========================= */}

        <div className="report-list">

          {sortedReports.length === 0 ? (

            <div className="empty-data">

              Belum ada laporan.

            </div>

          ) : (

            sortedReports.map(
              (report) => {

                const student =
                  getStudent(
                    report.studentId
                  );


                return (

                  <div
                    className="report-card"
                    key={report.id}
                  >


                    {/* HEADER CARD */}

                    <div className="report-card-header">

                      <div>

                        <h2>
                          {report.subject}
                        </h2>

                        <p>

                          {student?.name}

                          {" • "}

                          {formatDate(
                            report.date
                          )}

                        </p>

                      </div>


                      <strong
                        className="report-score"
                      >
                        {report.score}
                      </strong>

                    </div>


                    {/* MATERI */}

                    <div className="report-material">

                      <strong>
                        📚 Materi
                      </strong>

                      <p>
                        {report.material}
                      </p>

                    </div>


                    {/* CATATAN */}

                    <div className="report-note">

                      <strong>
                        💬 Catatan Tutor
                      </strong>

                      <p>
                        {report.tutorNote}
                      </p>

                    </div>


                    {/* REKOMENDASI */}

                    <div className="report-note">

                      <strong>
                        🎯 Rekomendasi
                      </strong>

                      <p>

                        {report.recommendation ||
                          "Tidak ada rekomendasi."}

                      </p>

                    </div>


                    {/* FOOTER */}

                    <div className="report-footer">

                      <span>

                        📅{" "}

                        {report.attendance}

                      </span>


                      {user?.role === "tutor" && (

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteReport(
                              report.id
                            )
                          }
                          title="Hapus laporan"
                        >
                          🗑
                        </button>

                      )}

                    </div>

                  </div>

                );

              }
            )

          )}

        </div>

      </div>


      {/* =========================
          MODAL TAMBAH LAPORAN
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal report-modal">


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  📊 Tambah Laporan
                </h2>

                <p>
                  Isi perkembangan murid setelah pembelajaran.
                </p>

              </div>


              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleAddReport
              }
            >


              {/* MURID */}

              <label>
                Murid
              </label>

              <select
                value={
                  newReport.studentId
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    studentId:
                      e.target.value,

                  })
                }
              >

                <option value="">
                  -- Pilih Murid --
                </option>


                {visibleStudents.map(
                  (student) => {

                    const studentPackage =
                      getPackageByStudent(
                        student.id
                      );


                    const packageStatus =
                      getPackageStatus(
                        studentPackage
                      );


                    return (

                      <option
                        key={student.id}
                        value={student.id}
                      >

                        {student.name}
                        {" - "}
                        {student.className}

                        {!studentPackage
                          ? " - Belum ada paket"
                          : packageStatus.status ===
                            "expired"
                          ? " - Paket Habis"
                          : ` - Sisa ${
                              studentPackage.totalMeetings -
                              studentPackage.usedMeetings
                            } pertemuan`}

                      </option>

                    );

                  }
                )}

              </select>


              {/* TANGGAL */}

              <label>
                Tanggal
              </label>

              <input
                type="date"
                value={
                  newReport.date
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    date:
                      e.target.value,

                  })
                }
              />


              {/* MAPEL */}

              <label>
                Mata Pelajaran
              </label>

              <input
                type="text"
                placeholder="Contoh: Matematika"
                value={
                  newReport.subject
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    subject:
                      e.target.value,

                  })
                }
              />


              {/* MATERI */}

              <label>
                Materi
              </label>

              <input
                type="text"
                placeholder="Contoh: Perbandingan"
                value={
                  newReport.material
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    material:
                      e.target.value,

                  })
                }
              />


              {/* NILAI */}

              <label>
                Nilai
              </label>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="0 - 100"
                value={
                  newReport.score
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    score:
                      e.target.value,

                  })
                }
              />


              {/* KEHADIRAN */}

              <label>
                Kehadiran
              </label>

              <select
                value={
                  newReport.attendance
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    attendance:
                      e.target.value,

                  })
                }
              >

                <option value="Hadir">
                  Hadir
                </option>

                <option value="Izin">
                  Izin
                </option>

                <option value="Sakit">
                  Sakit
                </option>

                <option value="Alpa">
                  Alpa
                </option>

              </select>


              {/* CATATAN */}

              <label>
                Catatan Tutor
              </label>

              <textarea
                rows="4"
                placeholder="Tuliskan perkembangan belajar murid..."
                value={
                  newReport.tutorNote
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    tutorNote:
                      e.target.value,

                  })
                }
              />


              {/* REKOMENDASI */}

              <label>
                Rekomendasi
              </label>

              <textarea
                rows="3"
                placeholder="Contoh: Perbanyak latihan soal cerita."
                value={
                  newReport.recommendation
                }
                onChange={(e) =>
                  setNewReport({

                    ...newReport,

                    recommendation:
                      e.target.value,

                  })
                }
              />


              {/* =========================
                  INFO PAKET
              ========================= */}

              {newReport.studentId && (

                <div
                  className="report-package-info"
                >

                  {(() => {

                    const selectedPackage =
                      getPackageByStudent(
                        newReport.studentId
                      );


                    if (!selectedPackage) {

                      return (

                        <div className="package-danger">

                          🔴 Murid belum memiliki paket.

                        </div>

                      );

                    }


                    const status =
                      getPackageStatus(
                        selectedPackage
                      );


                    const remaining =
                      Math.max(

                        selectedPackage.totalMeetings -
                          selectedPackage.usedMeetings,

                        0

                      );


                    return (

                      <div
                        className={
                          status.className
                        }
                      >

                        {status.color ===
                          "green" && "🟢"}

                        {status.color ===
                          "yellow" && "🟡"}

                        {status.color ===
                          "red" && "🔴"}

                        {" "}

                        <strong>
                          {status.label}
                        </strong>

                        {" — Sisa "}

                        {remaining}

                        {" pertemuan"}

                      </div>

                    );

                  })()}

                </div>

              )}


              {/* ACTION */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Batal
                </button>


                <button
                  type="submit"
                  className="save-button"
                >
                  Simpan Laporan
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