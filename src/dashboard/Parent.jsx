import DashboardLayout from "../layouts/DashboardLayout";

import {
  getPackageByStudent,
  getRemainingMeetings,
  getPackageStatus,
} from "../data/packageStorage";

import { getStudentById } from "../data/studentStorage";


function Parent() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID
  // =========================

  const child = user?.studentId
    ? getStudentById(user.studentId)
    : null;


  // =========================
  // PAKET ANAK
  // =========================

  const packageItem =
    child
      ? getPackageByStudent(
          child.id
        )
      : null;


  const remaining =
    packageItem
      ? getRemainingMeetings(
          packageItem
        )
      : 0;


  const packageStatus =
    packageItem
      ? getPackageStatus(
          packageItem
        )
      : {
          label:
            "Belum Ada Paket",

          className:
            "package-danger",

          canTeach:
            false,
        };


  // =========================
  // LAPORAN
  // =========================

  const reports = JSON.parse(
    localStorage.getItem(
      "reports"
    ) || "[]"
  );


  const childReports =
    reports.filter(
      (report) =>
        report.studentId ===
        child?.id
    );


  // =========================
  // NILAI
  // =========================

  const scoreReports =
    childReports.filter(
      (report) =>
        report.attendance !==
          "Izin" &&
        report.attendance !==
          "Sakit" &&
        report.attendance !==
          "Alpa"
    );


  const averageScore =
    scoreReports.length > 0
      ? Math.round(
          scoreReports.reduce(
            (total, report) =>
              total +
              Number(report.score),
            0
          ) /
            scoreReports.length
        )
      : 0;


  // =========================
  // PRESENSI
  // =========================

  const totalAttendance =
    childReports.length;


  const totalPresent =
    childReports.filter(
      (report) =>
        report.attendance ===
        "Hadir"
    ).length;


  const attendance =
    totalAttendance > 0
      ? Math.round(
          (
            totalPresent /
            totalAttendance
          ) * 100
        )
      : 0;


  // =========================
  // STATUS NILAI
  // =========================

  const getStatus = (
    score
  ) => {

    if (score >= 90) {

      return {
        text: "Sangat Baik",
        className:
          "performance-excellent",
      };

    }


    if (score >= 75) {

      return {
        text: "Baik",
        className:
          "performance-good",
      };

    }


    return {
      text:
        "Perlu Perhatian",

      className:
        "performance-warning",
    };

  };


  // =========================
  // DATA ANAK TIDAK ADA
  // =========================

  if (!child) {

    return (

      <DashboardLayout>

        <div className="parent-empty">

          <div className="parent-empty-icon">
            👨‍👩‍👧
          </div>

          <h2>
            Data anak belum ditemukan
          </h2>

          <p>
            Silakan hubungi administrator
            untuk memastikan akun orang tua
            sudah terhubung dengan data anak.
          </p>

        </div>

      </DashboardLayout>

    );

  }


  const status =
    getStatus(
      averageScore
    );


  return (

    <DashboardLayout>

      <div className="parent-dashboard">


        {/* =========================
            WELCOME
        ========================= */}

        <div className="parent-welcome">

          <div>

            <p className="parent-small-title">
              Dashboard Orang Tua
            </p>

            <h1>
              Halo, {user?.name} 👋
            </h1>

            <p>
              Pantau perkembangan belajar{" "}
              {child.name} di sini.
            </p>

          </div>

        </div>


        {/* =========================
            CHILD PROFILE
        ========================= */}

        <div className="child-profile-card">

          <div className="child-avatar">
            {child.gender === "Laki-laki"
              ? "👦"
              : child.gender === "Perempuan"
              ? "👧"
              : "🧑‍🎓"}
          </div>


          <div className="child-info">

            <span>
              Anak Anda
            </span>

            <h2>
              {child.name}
            </h2>

            <p>
              {child.id}
              {" • "}
              {child.className}
            </p>

          </div>


          <div className="child-tutor">

            <span>
              Tutor
            </span>

            <strong>
              👩‍🏫 {child.tutor}
            </strong>

          </div>


          {/* =========================
              STATUS PAKET
          ========================= */}

          <div className="child-package">

            <span>
              📦 Paket Belajar
            </span>

            <strong
              className={
                packageStatus.className
              }
            >
              {packageStatus.label}
            </strong>

            <small>
              Sisa{" "}
              <b>
                {remaining}
              </b>{" "}
              pertemuan
            </small>

          </div>

        </div>


        {/* =========================
            DETAIL PAKET
        ========================= */}

        <div className="parent-package-panel">

          <div>

            <span>
              📦 Paket Aktif
            </span>

            <h3>
              {packageItem
                ? packageItem.packageName
                : "Belum ada paket"}
            </h3>

            {packageItem && (

              <p>
                Total paket:{" "}
                <strong>
                  {packageItem.totalMeetings}
                </strong>{" "}
                pertemuan
              </p>

            )}

          </div>


          <div className="parent-package-right">

            <strong
              className={
                packageStatus.className
              }
            >
              {remaining}
            </strong>

            <span>
              pertemuan tersisa
            </span>

          </div>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="parent-section-title">

          <h2>
            Ringkasan Perkembangan
          </h2>

          <p>
            Data terbaru perkembangan
            belajar anak.
          </p>

        </div>


        <div className="parent-stats">


          {/* PRESENSI */}

          <div className="parent-stat-card">

            <div className="parent-stat-icon">
              📅
            </div>

            <div>

              <span>
                Kehadiran
              </span>

              <strong>
                {attendance}%
              </strong>

              <small>
                {totalPresent} dari{" "}
                {totalAttendance}{" "}
                pertemuan
              </small>

            </div>

          </div>


          {/* NILAI */}

          <div className="parent-stat-card">

            <div className="parent-stat-icon">
              📝
            </div>

            <div>

              <span>
                Rata-rata Nilai
              </span>

              <strong>
                {averageScore}
              </strong>

              <small>
                Nilai akademik
              </small>

            </div>

          </div>


          {/* STATUS */}

          <div className="parent-stat-card">

            <div className="parent-stat-icon">
              ⭐
            </div>

            <div>

              <span>
                Perkembangan
              </span>

              <strong
                className={
                  status.className
                }
              >
                {status.text}
              </strong>

              <small>
                Berdasarkan nilai terbaru
              </small>

            </div>

          </div>

        </div>


        {/* =========================
            DETAIL
        ========================= */}

        <div className="parent-detail-grid">


          {/* PRESENSI */}

          <div className="parent-panel">

            <div className="parent-panel-header">

              <div>

                <h3>
                  📅 Presensi
                </h3>

                <p>
                  Rekap kehadiran{" "}
                  {child.name}
                </p>

              </div>

              <strong>
                {attendance}%
              </strong>

            </div>


            <div className="progress-bar">

              <div
                className="progress-fill attendance-progress"
                style={{
                  width:
                    `${attendance}%`,
                }}
              />

            </div>


            <div className="attendance-summary">

              <span>
                Hadir:{" "}
                <strong>
                  {totalPresent}
                </strong>
              </span>

              <span>
                Tidak hadir:{" "}
                <strong>
                  {totalAttendance -
                    totalPresent}
                </strong>
              </span>

            </div>

          </div>


          {/* NILAI */}

          <div className="parent-panel">

            <div className="parent-panel-header">

              <div>

                <h3>
                  📝 Nilai
                </h3>

                <p>
                  Rata-rata nilai anak
                </p>

              </div>

              <strong>
                {averageScore}
              </strong>

            </div>


            <div className="progress-bar">

              <div
                className="progress-fill score-progress"
                style={{
                  width:
                    `${averageScore}%`,
                }}
              />

            </div>


            <div className="score-message">

              {averageScore >= 85

                ? "🎉 Performa belajar sangat baik!"

                : "💪 Tetap semangat belajar!"}

            </div>

          </div>

        </div>


        {/* =========================
            QUICK MENU
        ========================= */}

        <div className="parent-section-title">

          <h2>
            Menu
          </h2>

        </div>


        <div className="parent-menu-grid">


          <a
            href="/nilai"
            className="parent-menu-card"
          >

            <span>
              📝
            </span>

            <div>

              <strong>
                Nilai
              </strong>

              <small>
                Lihat nilai anak
              </small>

            </div>

            <b>
              →
            </b>

          </a>


          <a
            href="/presensi"
            className="parent-menu-card"
          >

            <span>
              📅
            </span>

            <div>

              <strong>
                Presensi
              </strong>

              <small>
                Lihat kehadiran anak
              </small>

            </div>

            <b>
              →
            </b>

          </a>


          <a
            href="/laporan"
            className="parent-menu-card"
          >

            <span>
              📊
            </span>

            <div>

              <strong>
                Laporan
              </strong>

              <small>
                Lihat perkembangan anak
              </small>

            </div>

            <b>
              →
            </b>

          </a>


          <a
            href="/pembayaran"
            className="parent-menu-card"
          >

            <span>
              💰
            </span>

            <div>

              <strong>
                Pembayaran
              </strong>

              <small>
                Informasi pembayaran
              </small>

            </div>

            <b>
              →
            </b>

          </a>

        </div>


      </div>

    </DashboardLayout>

  );

}


export default Parent;