import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

import { getStudents } from "../data/studentStorage";

import {
  getAttendance,
  addAttendance,
  deleteAttendance,
} from "../data/attendanceStorage";


function Attendance() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID
  // =========================

  const [students] = useState(
    getStudents()
  );


  // =========================
  // DATA PRESENSI
  // =========================

  const [attendanceData, setAttendanceData] =
    useState(
      getAttendance()
    );


  // =========================
  // FORM
  // =========================

  const [showForm, setShowForm] =
    useState(false);


  const [newAttendance, setNewAttendance] =
    useState({
      studentId: "",
      date: "",
      subject: "",
      attendance: "Hadir",
    });


  // =========================
  // MURID YANG BOLEH DILIHAT
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
  // ID MURID
  // =========================

  const visibleStudentIds =
    visibleStudents.map(
      (student) =>
        student.id
    );


  // =========================
  // FILTER PRESENSI
  // =========================

  const visibleAttendance =
    attendanceData.filter(
      (attendance) =>
        visibleStudentIds.includes(
          attendance.studentId
        )
    );


  // =========================
  // GABUNGKAN DATA
  // =========================

  const attendanceWithStudent =
    visibleAttendance.map(
      (attendance) => {

        const student =
          students.find(
            (item) =>
              item.id ===
              attendance.studentId
          );


        return {
          ...attendance,

          studentName:
            student?.name,

          className:
            student?.className,
        };
      }
    );


  // =========================
  // SUMMARY
  // =========================

  const totalAttendance =
    attendanceWithStudent.length;


  const totalHadir =
    attendanceWithStudent.filter(
      (item) =>
        item.attendance ===
        "Hadir"
    ).length;


  const totalIzin =
    attendanceWithStudent.filter(
      (item) =>
        item.attendance ===
        "Izin"
    ).length;


  const totalSakit =
    attendanceWithStudent.filter(
      (item) =>
        item.attendance ===
        "Sakit"
    ).length;


  const totalAlpa =
    attendanceWithStudent.filter(
      (item) =>
        item.attendance ===
        "Alpa"
    ).length;


  // =========================
  // FORMAT STATUS
  // =========================

  const getAttendanceClass =
    (status) => {

      if (status === "Hadir") {
        return "attendance-status hadir";
      }


      if (status === "Izin") {
        return "attendance-status izin";
      }


      if (status === "Sakit") {
        return "attendance-status sakit";
      }


      return "attendance-status alpa";
    };


  const getAttendanceLabel =
    (status) => {

      if (status === "Hadir") {
        return "✅ Hadir";
      }


      if (status === "Izin") {
        return "🟡 Izin";
      }


      if (status === "Sakit") {
        return "🔵 Sakit";
      }


      if (status === "Alpa") {
        return "🔴 Alpa";
      }


      return status;
    };


  // =========================
  // INPUT FORM
  // =========================

  const handleChange = (e) => {

    setNewAttendance({
      ...newAttendance,

      [e.target.name]:
        e.target.value,
    });
  };


  // =========================
  // BUKA FORM
  // =========================

  const handleOpenForm = () => {

    setNewAttendance({
      studentId: "",
      date: "",
      subject: "",
      attendance: "Hadir",
    });

    setShowForm(true);
  };


  // =========================
  // SIMPAN PRESENSI
  // =========================

  const handleSubmit = (e) => {

    e.preventDefault();


    if (
      !newAttendance.studentId ||
      !newAttendance.date ||
      !newAttendance.subject ||
      !newAttendance.attendance
    ) {

      alert(
        "Mohon lengkapi semua data presensi."
      );

      return;
    }


    const newData = {

      id:
        `ATT${Date.now()}`,

      studentId:
        newAttendance.studentId,

      date:
        newAttendance.date,

      subject:
        newAttendance.subject,

      attendance:
        newAttendance.attendance,
    };


    const updatedAttendance =
      addAttendance(
        newData
      );


    setAttendanceData(
      updatedAttendance
    );


    setNewAttendance({
      studentId: "",
      date: "",
      subject: "",
      attendance: "Hadir",
    });


    setShowForm(false);
  };


  // =========================
  // HAPUS PRESENSI
  // =========================

  const handleDelete = (
    attendance
  ) => {

    if (
      user?.role !== "admin" &&
      user?.role !== "tutor"
    ) {
      return;
    }


    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus data presensi ini?"
      );


    if (!confirmDelete) {
      return;
    }


    const updatedAttendance =
      deleteAttendance(
        attendance.id
      );


    setAttendanceData(
      updatedAttendance
    );
  };


  return (
    <DashboardLayout>

      <div className="attendance-page">


        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              📅 Presensi
            </h1>

            <p>
              Rekap kehadiran murid.
            </p>

          </div>


          {(user?.role === "admin" ||
            user?.role === "tutor") && (

            <button
              className="add-button"
              onClick={
                handleOpenForm
              }
            >
              + Tambah Presensi
            </button>

          )}

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="attendance-summary">


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              👨‍🎓
            </span>

            <div>

              <span>
                Murid
              </span>

              <strong>
                {
                  visibleStudents.length
                }
              </strong>

            </div>

          </div>


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              📅
            </span>

            <div>

              <span>
                Total Presensi
              </span>

              <strong>
                {
                  totalAttendance
                }
              </strong>

            </div>

          </div>


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              ✅
            </span>

            <div>

              <span>
                Hadir
              </span>

              <strong>
                {totalHadir}
              </strong>

            </div>

          </div>


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              🟡
            </span>

            <div>

              <span>
                Izin
              </span>

              <strong>
                {totalIzin}
              </strong>

            </div>

          </div>


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              🔵
            </span>

            <div>

              <span>
                Sakit
              </span>

              <strong>
                {totalSakit}
              </strong>

            </div>

          </div>


          <div className="attendance-summary-card">

            <span className="summary-small-icon">
              🔴
            </span>

            <div>

              <span>
                Alpa
              </span>

              <strong>
                {totalAlpa}
              </strong>

            </div>

          </div>


        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="attendance-table-card">


          <div className="table-title">

            <div>

              <h2>
                Riwayat Presensi
              </h2>

              <p>
                Data kehadiran murid terbaru.
              </p>

            </div>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Murid
                  </th>

                  <th>
                    Kelas
                  </th>

                  <th>
                    Tanggal
                  </th>

                  <th>
                    Mata Pelajaran
                  </th>

                  <th>
                    Status
                  </th>

                  {(user?.role === "admin" ||
                    user?.role === "tutor") && (

                    <th>
                      Aksi
                    </th>

                  )}

                </tr>

              </thead>


              <tbody>

                {attendanceWithStudent.length >
                0 ? (

                  attendanceWithStudent.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>

                          <div className="attendance-student">

                            <div className="attendance-avatar">
                              👨‍🎓
                            </div>

                            <strong>
                              {
                                item.studentName
                              }
                            </strong>

                          </div>

                        </td>


                        <td>
                          {
                            item.className
                          }
                        </td>


                        <td>
                          {
                            item.date
                          }
                        </td>


                        <td>
                          {
                            item.subject
                          }
                        </td>


                        <td>

                          <span
                            className={getAttendanceClass(
                              item.attendance
                            )}
                          >

                            {
                              getAttendanceLabel(
                                item.attendance
                              )
                            }

                          </span>

                        </td>


                        {(user?.role === "admin" ||
                          user?.role === "tutor") && (

                          <td>

                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                              title="Hapus"
                            >
                              🗑️
                            </button>

                          </td>

                        )}

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={
                        user?.role === "admin" ||
                        user?.role === "tutor"
                          ? "6"
                          : "5"
                      }
                      className="empty-data"
                    >

                      📅 Belum ada data
                      presensi.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>


      {/* =========================
          MODAL TAMBAH PRESENSI
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal">


            <div className="modal-header">

              <div>

                <h2>
                  📅 Tambah Presensi
                </h2>

                <p>
                  Masukkan data kehadiran murid.
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
            >


              {/* MURID */}

              <label>
                Murid
              </label>

              <select
                name="studentId"
                value={
                  newAttendance.studentId
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Pilih Murid
                </option>

                {visibleStudents.map(
                  (student) => (

                    <option
                      key={
                        student.id
                      }
                      value={
                        student.id
                      }
                    >

                      {
                        student.name
                      }

                    </option>

                  )
                )}

              </select>


              {/* TANGGAL */}

              <label>
                Tanggal
              </label>

              <input
                type="date"
                name="date"
                value={
                  newAttendance.date
                }
                onChange={
                  handleChange
                }
              />


              {/* MAPEL */}

              <label>
                Mata Pelajaran
              </label>

              <input
                type="text"
                name="subject"
                placeholder="Contoh: Matematika"
                value={
                  newAttendance.subject
                }
                onChange={
                  handleChange
                }
              />


              {/* STATUS */}

              <label>
                Status
              </label>

              <select
                name="attendance"
                value={
                  newAttendance.attendance
                }
                onChange={
                  handleChange
                }
              >

                <option value="Hadir">
                  ✅ Hadir
                </option>

                <option value="Izin">
                  🟡 Izin
                </option>

                <option value="Sakit">
                  🔵 Sakit
                </option>

                <option value="Alpa">
                  🔴 Alpa
                </option>

              </select>


              {/* BUTTON */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(
                      false
                    )
                  }
                >
                  Batal
                </button>


                <button
                  type="submit"
                  className="save-button"
                >
                  Simpan Presensi
                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}


export default Attendance;