import DashboardLayout from "../layouts/DashboardLayout";
import { studentData } from "../data/studentData";
import { reportData } from "../data/reportData";

function Scores() {
  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // DATA LAPORAN
  // =========================

  const reports =
    JSON.parse(
      localStorage.getItem("reports")
    ) || reportData;

  // =========================
  // MURID YANG BISA DILIHAT
  // =========================

  const visibleStudents =
    studentData.filter((student) => {
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
  // NILAI YANG BISA DILIHAT
  // =========================

  const visibleStudentIds =
    visibleStudents.map(
      (student) => student.id
    );

  const visibleReports =
    reports
      .filter((report) =>
        visibleStudentIds.includes(
          report.studentId
        )
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

  // =========================
  // DATA MURID
  // =========================

  const getStudent = (studentId) => {
    return studentData.find(
      (student) =>
        student.id === studentId
    );
  };

  // =========================
  // STATUS NILAI
  // =========================

  const getScoreStatus = (score) => {
    const numericScore =
      Number(score);

    if (numericScore >= 90) {
      return "Sangat Baik";
    }

    if (numericScore >= 75) {
      return "Baik";
    }

    if (numericScore > 0) {
      return "Perlu Perhatian";
    }

    return "Belum ada nilai";
  };

  const getAverageLabel = (report) => {
  if (report.includeInAverage === false) {
    return {
      text: "Tidak dihitung dalam rata-rata",
      className: "score-not-in-average",
    };
  }

  return {
    text: "Dihitung dalam rata-rata",
    className: "score-in-average",
  };
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
  // RATA-RATA NILAI
  // =========================

  const validScores =
    visibleReports
      .map((report) =>
        Number(report.score)
      )
      .filter(
        (score) =>
          !isNaN(score)
      );

  const averageScore =
    validScores.length > 0
      ? Math.round(
          validScores.reduce(
            (total, score) =>
              total + score,
            0
          ) /
            validScores.length
        )
      : 0;

  // =========================
  // TAMPILAN
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
              Pantau perkembangan
              nilai akademik murid.
            </p>

          </div>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="attendance-summary">

          {/* JUMLAH MURID */}

          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              👨‍🎓
            </span>

            <div>

              <span>
                Murid
              </span>

              <strong>
                {visibleStudents.length}
              </strong>

            </div>

          </div>


          {/* JUMLAH NILAI */}

          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              📝
            </span>

            <div>

              <span>
                Total Nilai
              </span>

              <strong>
                {visibleReports.length}
              </strong>

            </div>

          </div>


          {/* RATA-RATA */}

          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              ⭐
            </span>

            <div>

              <span>
                Rata-rata Nilai
              </span>

              <strong>
                {averageScore}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================
            DATA NILAI
        ========================= */}

        <div className="scores-list">

          {visibleReports.length === 0 ? (

            <div className="empty-data">

              Belum ada data nilai.

            </div>

          ) : (

            visibleReports.map(
              (report) => {

                const student =
                  getStudent(
                    report.studentId
                  );

                  const averageLabel =
                    getAverageLabel(report);

                const score =
                  Number(
                    report.score
                  ) || 0;

                return (

                  <div
                    className="score-card"
                    key={report.id}
                  >

                    {/* =========================
                        HEADER CARD
                    ========================= */}

                    <div className="score-card-main">

                      <div className="score-student">

                        <div className="score-avatar">
                          👨‍🎓
                        </div>

                        <div>

                          <h2>
                            {student?.name ||
                              "Murid"}
                          </h2>

                          <p>
                            {student?.id}
                            {" • "}
                            {student?.className}
                          </p>

                        </div>

                      </div>


                      {/* NILAI */}

                     <div className="score-value">

  <span>
    Nilai
  </span>

  <strong>
    {report.score}
  </strong>

  <small
    className={averageLabel.className}
  >
    {averageLabel.text}
  </small>

</div>

                    </div>


                    {/* =========================
                        DETAIL
                    ========================= */}

                    <div className="score-details">

                      {/* TANGGAL */}

                      <div>

                        <span>
                          📅 Tanggal
                        </span>

                        <strong>
                          {formatDate(
                            report.date
                          )}
                        </strong>

                      </div>


                      {/* MAPEL */}

                      <div>

                        <span>
                          📚 Mata Pelajaran
                        </span>

                        <strong>
                          {report.subject}
                        </strong>

                      </div>


                      {/* MATERI */}

                      <div>

                        <span>
                          📖 Materi
                        </span>

                        <strong>
                          {report.material}
                        </strong>

                      </div>


                      {/* STATUS */}

                      <div>

                        <span>
                          ⭐ Status
                        </span>

                        <strong>
                          {getScoreStatus(
                            score
                          )}
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