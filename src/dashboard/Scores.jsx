import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

import { getStudents } from "../data/studentStorage";
import { getReports } from "../data/reportStorage";


function Scores() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID & LAPORAN
  // =========================
  // Sekarang diambil dari Firestore

  const [students, setStudents] = useState([]);

  const [reports, setReports] = useState([]);

  const [loadingData, setLoadingData] =
    useState(true);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    setLoadingData(true);

    const [studentsData, reportsData] =
      await Promise.all([
        getStudents(),
        getReports(),
      ]);

    setStudents(studentsData);
    setReports(reportsData);

    setLoadingData(false);

  };


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

      return visibleStudents.some(
        (student) =>
          student.id ===
          report.studentId
      );

    });


  // =========================
  // CARI MURID
  // =========================

  const getStudent = (studentId) => {

    return students.find(
      (student) =>
        student.id === studentId
    );

  };


  // =========================
  // HITUNG RATA-RATA NILAI
  // =========================
  //
  // HANYA LAPORAN DENGAN
  // KEHADIRAN "Hadir"
  //
  // Izin  = tidak dihitung
  // Sakit = tidak dihitung
  // Alpa  = tidak dihitung
  //

  const getAverageScore = (studentId) => {

    const studentReports =
      visibleReports.filter(
        (report) =>
          report.studentId ===
            studentId &&
          report.attendance ===
            "Hadir"
      );


    // Belum ada nilai yang
    // memenuhi syarat

    if (
      studentReports.length ===
      0
    ) {

      return null;

    }


    const totalScore =
      studentReports.reduce(
        (total, report) =>
          total +
          Number(report.score || 0),
        0
      );


    const average =
      totalScore /
      studentReports.length;


    return Number(
      average.toFixed(1)
    );

  };


  // =========================
  // STATUS NILAI
  // =========================

  const getScoreStatus = (score) => {

    if (score === null) {

      return {

        text: "Belum ada nilai",

        className:
          "score-status-empty",

      };

    }


    if (score >= 90) {

      return {

        text: "Sangat Baik",

        className:
          "score-status-excellent",

      };

    }


    if (score >= 75) {

      return {

        text: "Baik",

        className:
          "score-status-good",

      };

    }


    return {

      text: "Perlu Perhatian",

      className:
        "score-status-warning",

    };

  };


  // =========================
  // FORMAT NILAI
  // =========================

  const formatScore = (score) => {

    if (score === null) {

      return "-";

    }


    return score;

  };


  // =========================
  // JUMLAH NILAI
  // =========================

  const getScoreCount = (studentId) => {

    return visibleReports.filter(
      (report) =>
        report.studentId ===
          studentId &&
        report.attendance ===
          "Hadir"
    ).length;

  };


  // =========================
  // SEDANG MEMUAT
  // =========================

  if (loadingData) {

    return (

      <DashboardLayout>

        <div className="scores-page">

          <div className="empty-data">
            Memuat data nilai...
          </div>

        </div>

      </DashboardLayout>

    );

  }


  // =========================
  // RENDER
  // =========================

  return (

    <DashboardLayout>

      <div className="scores-page">


        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              📝 Nilai
            </h1>

            <p>
              Pantau perkembangan nilai akademik murid.
            </p>

          </div>

        </div>


        {/* =========================
            DATA NILAI
        ========================= */}

        <div className="scores-list">

          {visibleStudents.length === 0 ? (

            <div className="empty-data">

              Belum ada data murid.

            </div>

          ) : (

            visibleStudents.map(
              (student) => {

                const averageScore =
                  getAverageScore(
                    student.id
                  );


                const scoreStatus =
                  getScoreStatus(
                    averageScore
                  );


                const scoreCount =
                  getScoreCount(
                    student.id
                  );


                return (

                  <div
                    className="score-card"
                    key={student.id}
                  >


                    {/* =========================
                        HEADER CARD
                    ========================= */}

                    <div className="score-card-main">


                      {/* MURID */}

                      <div className="score-student">

                        <div className="score-avatar">

                          👨‍🎓

                        </div>


                        <div>

                          <h2>

                            {student.name}

                          </h2>


                          <p>

                            {student.id}
                            {" • "}
                            {student.className}

                          </p>

                        </div>

                      </div>


                      {/* NILAI RATA-RATA */}

                      <div className="score-value">

                        <span>
                          Rata-rata Nilai
                        </span>


                        <strong>

                          {formatScore(
                            averageScore
                          )}

                        </strong>


                        <small>

                          {scoreCount}
                          {" "}
                          nilai dihitung

                        </small>

                      </div>

                    </div>


                    {/* =========================
                        DETAIL
                    ========================= */}

                    <div className="score-details">


                      {/* STATUS */}

                      <div>

                        <span>
                          ⭐ Status
                        </span>


                        <strong
                          className={
                            scoreStatus.className
                          }
                        >

                          {scoreStatus.text}

                        </strong>

                      </div>


                      {/* NILAI DIHITUNG */}

                      <div>

                        <span>
                          📊 Nilai dihitung
                        </span>


                        <strong>

                          {scoreCount}
                          {" "}
                          pertemuan

                        </strong>

                      </div>


                      {/* NILAI TIDAK DIHITUNG */}

                      <div>

                        <span>
                          🚫 Tidak dihitung
                        </span>


                        <strong>

                          {
                            visibleReports.filter(
                              (report) =>
                                report.studentId ===
                                  student.id &&
                                report.attendance !==
                                  "Hadir"
                            ).length
                          }
                          {" "}
                          pertemuan

                        </strong>

                      </div>


                      {/* STATUS KEHADIRAN */}

                      <div>

                        <span>
                          📅 Ketentuan
                        </span>


                        <strong>

                          Hanya "Hadir"

                        </strong>

                      </div>

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


export default Scores;