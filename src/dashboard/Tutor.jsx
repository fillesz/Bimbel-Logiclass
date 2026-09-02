import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

import { getStudents } from "../data/studentStorage";

import { getReports } from "../data/reportStorage";

import {
  getPackages,
  getRemainingMeetings,
  getPackageStatus,
} from "../data/packageStorage";


function Tutor() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID / LAPORAN / PAKET
  // =========================
  // Semuanya dari Firestore sekarang, jadi
  // diambil lewat useEffect (async). "packages"
  // diambil sekaligus (bukan per-murid) supaya
  // render list murid bisa cari paket secara
  // SYNC dari state, tanpa await di tengah JSX.

  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [packages, setPackages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {

      setIsLoading(true);

      try {

        const [
          studentsData,
          reportsData,
          packagesData,
        ] = await Promise.all([
          getStudents(),
          getReports(),
          getPackages(),
        ]);

        setStudents(studentsData);
        setReports(reportsData);
        setPackages(packagesData);

      } catch (error) {

        console.error(
          "Gagal memuat data dashboard tutor:",
          error
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadData();

  }, []);


  // =========================
  // CARI PAKET MURID (SYNC, DARI STATE)
  // =========================

  const getStudentPackage = (studentId) => {

    return packages.find(
      (pkg) => pkg.studentId === studentId
    );

  };


  // =========================
  // MURID MILIK TUTOR
  // =========================

  const myStudents =
    students.filter(
      (student) =>
        student.tutorId ===
        user?.tutorId
    );


  // =========================
  // TOTAL MURID
  // =========================

  const totalStudents =
    myStudents.length;


  // =========================
  // RATA-RATA PRESENSI
  // =========================

  const averageAttendance =
    reports.length > 0
      ? Math.round(
          (
            reports.filter(
              (report) =>
                report.attendance ===
                "Hadir" &&
                myStudents.some(
                  (student) =>
                    student.id ===
                    report.studentId
                )
            ).length /
            reports.filter(
              (report) =>
                myStudents.some(
                  (student) =>
                    student.id ===
                    report.studentId
                )
            ).length
          ) * 100
        )
      : 0;


  // =========================
  // RATA-RATA NILAI
  // =========================

  const scoreReports =
    reports.filter(
      (report) =>
        myStudents.some(
          (student) =>
            student.id ===
            report.studentId
        ) &&
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
  // PRESENSI TERBARU
  // =========================

  const attendanceData =
    reports
      .filter(
        (report) =>
          myStudents.some(
            (student) =>
              student.id ===
              report.studentId
          )
      )
      .slice(-3)
      .reverse()
      .map((report) => {

        const student =
          students.find(
            (item) =>
              item.id ===
              report.studentId
          );

        return {
          student:
            student?.name || "-",

          date:
            report.date,

          status:
            report.attendance,
        };

      });


  // =========================
  // NILAI TERBARU
  // =========================

  const scoreData =
    reports
      .filter(
        (report) =>
          myStudents.some(
            (student) =>
              student.id ===
              report.studentId
          )
      )
      .slice(-3)
      .reverse()
      .map((report) => {

        const student =
          students.find(
            (item) =>
              item.id ===
              report.studentId
          );

        return {
          student:
            student?.name || "-",

          subject:
            report.subject,

          score:
            report.score,
        };

      });


  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="tutor-dashboard">

          <div className="empty-data">
            Memuat data dashboard...
          </div>

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>

      <div className="tutor-dashboard">

        {/* =========================
            HEADER
        ========================= */}

        <div className="dashboard-header">

          <div>

            <h1>
              Selamat datang,{" "}
              {user?.name}! 👋
            </h1>

            <p>
              Berikut ringkasan aktivitas
              mengajarmu.
            </p>

          </div>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="summary-grid">

          <div className="summary-card">

            <div className="summary-icon">
              👨‍🎓
            </div>

            <div>

              <span>
                Total Murid
              </span>

              <strong>
                {totalStudents}
              </strong>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              📅
            </div>

            <div>

              <span>
                Rata-rata Presensi
              </span>

              <strong>
                {averageAttendance || 0}%
              </strong>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              📝
            </div>

            <div>

              <span>
                Rata-rata Nilai
              </span>

              <strong>
                {averageScore || 0}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================
            MURID SAYA
        ========================= */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Murid Saya 👨‍🎓
              </h2>

              <p>
                Ringkasan perkembangan
                murid yang kamu ajar.
              </p>

            </div>

          </div>


          <div className="student-dashboard-list">

            {myStudents.length > 0 ? (

              myStudents.map(
                (student) => {

                  const packageItem =
                    getStudentPackage(
                      student.id
                    );


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


                  return (

                    <div
                      className="student-dashboard-card"
                      key={student.id}
                    >

                      {/* MURID */}

                      <div className="student-info">

                        <div className="student-avatar">
                          👨‍🎓
                        </div>

                        <div>

                          <h3>
                            {student.name}
                          </h3>

                          <p>
                            {student.id}
                            {" • "}
                            {student.className}
                          </p>

                        </div>

                      </div>


                      {/* PAKET */}

                      <div className="student-package-status">

                        <span>
                          📦 Paket
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

                  );

                }
              )

            ) : (

              <div className="empty-data">

                Belum ada murid.

              </div>

            )}

          </div>

        </div>


        {/* =========================
            BOTTOM SECTION
        ========================= */}

        <div className="dashboard-bottom-grid">


          {/* =========================
              PRESENSI
          ========================= */}

          <div className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📅 Presensi Terbaru
                </h2>

                <p>
                  Aktivitas kehadiran murid
                  terbaru.
                </p>

              </div>

            </div>


            <div className="activity-list">

              {attendanceData.length > 0 ? (

                attendanceData.map(
                  (item, index) => (

                    <div
                      className="activity-item"
                      key={index}
                    >

                      <div className="activity-icon">
                        📅
                      </div>

                      <div className="activity-info">

                        <strong>
                          {item.student}
                        </strong>

                        <span>
                          {item.date}
                        </span>

                      </div>

                      <span className="attendance-badge">

                        {item.status}

                      </span>

                    </div>

                  )
                )

              ) : (

                <div className="empty-data">

                  Belum ada data presensi.

                </div>

              )}

            </div>

          </div>


          {/* =========================
              NILAI
          ========================= */}

          <div className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📝 Nilai Terbaru
                </h2>

                <p>
                  Nilai terbaru murid.
                </p>

              </div>

            </div>


            <div className="activity-list">

              {scoreData.length > 0 ? (

                scoreData.map(
                  (item, index) => (

                    <div
                      className="activity-item"
                      key={index}
                    >

                      <div className="activity-icon">
                        📝
                      </div>

                      <div className="activity-info">

                        <strong>
                          {item.student}
                        </strong>

                        <span>
                          {item.subject}
                        </span>

                      </div>

                      <strong className="score-badge">

                        {item.score}

                      </strong>

                    </div>

                  )
                )

              ) : (

                <div className="empty-data">

                  Belum ada nilai.

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
}


export default Tutor;