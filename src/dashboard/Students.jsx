import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../data/studentStorage";
import { getAccounts } from "../data/accountStorage";


function Students() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // DATA MURID
  // =========================
  // Sekarang diambil dari Firestore
  // lewat useEffect (async)

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadStudents();

  }, []);

  const loadStudents = async () => {

    setLoading(true);

    const data = await getStudents();

    setStudents(data);

    setLoading(false);

  };

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  // =========================
  // FORM
  // =========================

  const [newStudent, setNewStudent] =
    useState({
      name: "",
      className: "",
      tutor: "",
      tutorId: "",
      gender: "",
    });
    

// =========================
// DATA TUTOR
// =========================
// Sekarang diambil dari Firestore

const [accounts, setAccounts] = useState([]);

useEffect(() => {

  getAccounts().then(setAccounts);

}, []);

const tutors = accounts
  .filter(
    (account) =>
      account.role === "tutor" &&
      account.tutorId
  )
  .map((account) => ({
    id: account.tutorId,
    name: account.name,
  }));


  // =========================
  // FILTER BERDASARKAN ROLE
  // =========================

  const visibleStudents =
    students.filter((student) => {

      if (user?.role === "admin") {
        return true;
      }

      if (user?.role === "tutor") {
        return (
          student.tutorId === user.tutorId
        );
      }

      if (user?.role === "parent") {
        return (
          student.id === user.studentId
        );
      }

      return false;
    });

  // =========================
  // SEARCH
  // =========================

  const filteredStudents =
    visibleStudents.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // =========================
  // INPUT
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  // =========================
  // BUKA TAMBAH
  // =========================

  const handleOpenAdd = () => {

    setEditingStudent(null);

    setNewStudent({
      name: "",
      className: "",
      tutor: "",
      tutorId: "",
      gender: "",
    });

    setShowForm(true);
  };

  // =========================
  // BUKA EDIT
  // =========================

  const handleEdit = (student) => {

    setEditingStudent(student);

    setNewStudent({
      name: student.name,
      className: student.className,
      tutor: student.tutor || "",
      tutorId: student.tutorId || "",
      gender: student.gender || "",
    });

    setShowForm(true);
  };

  // =========================
  // SIMPAN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !newStudent.name ||
      !newStudent.className ||
      !newStudent.tutorId ||
      !newStudent.gender
    ) {

      alert(
        "Mohon lengkapi semua data."
      );

      return;
    }

    // =========================
    // EDIT
    // =========================

    if (editingStudent) {

      await updateStudent(
        editingStudent.id,
        {
          name:
            newStudent.name,

          className:
            newStudent.className,

          tutor:
            newStudent.tutor,

          tutorId:
            newStudent.tutorId,

          gender:
            newStudent.gender,
        }
      );

      await loadStudents();

    }

    // =========================
    // TAMBAH
    // =========================

    else {

      const newId =
        `LG${String(
          students.length + 1
        ).padStart(3, "0")}`;

      const student = {

        id: newId,

        name:
          newStudent.name,

        className:
          newStudent.className,

        tutor:
          newStudent.tutor,

        tutorId:
          newStudent.tutorId,

        gender:
          newStudent.gender,

        status: "Aktif",
      };

      await addStudent(student);

      await loadStudents();
    }

    // =========================
    // RESET
    // =========================

    setNewStudent({
      name: "",
      className: "",
      tutor: "",
      tutorId: "",
      gender: "",
    });

    setEditingStudent(null);

    setShowForm(false);
  };

  // =========================
  // HAPUS
  // =========================

  const handleDelete = async (student) => {

    const confirmDelete =
      window.confirm(
        `Yakin ingin menghapus data ${student.name}?`
      );

    if (!confirmDelete) {
      return;
    }

    await deleteStudent(student.id);

    await loadStudents();
  };

  // =========================
  // RENDER
  // =========================

  return (
    <DashboardLayout>

      <div className="students-page">

        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              Data Murid 👨‍🎓
            </h1>

            <p>
              Kelola data murid yang
              terdaftar di LOGICLASS.
            </p>

          </div>

          {user?.role === "admin" && (

            <button
              className="add-button"
              onClick={
                handleOpenAdd
              }
            >
              + Tambah Murid
            </button>

          )}

        </div>


        {/* =========================
            SEARCH
        ========================= */}

        <div className="student-toolbar">

          <input
            type="text"
            placeholder="🔍 Cari nama murid..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="student-table-card">

          {loading ? (

            <div className="empty-data">
              Memuat data murid...
            </div>

          ) : (

          <table>

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Nama Murid
                </th>

                <th>
                  Kelas
                </th>

                <th>
                  Tutor
                </th>

                <th>
                  Status
                </th>

                {user?.role ===
                  "admin" && (

                  <th>
                    Aksi
                  </th>

                )}

              </tr>

            </thead>


            <tbody>

              {filteredStudents.length >
              0 ? (

                filteredStudents.map(
                  (
                    student,
                    index
                  ) => (

                    <tr
                      key={
                        student.id
                      }
                    >

                      <td>
                        {index + 1}
                      </td>


                      <td>

                        <strong>
                          {
                            student.name
                          }
                        </strong>

                      </td>


                      <td>
                        {
                          student.className
                        }
                      </td>


                      <td>
                        {
                          student.tutor ||
                          "-"
                        }
                      </td>


                      <td>

                        <span className="status-active">

                          {
                            student.status ||
                            "Aktif"
                          }

                        </span>

                      </td>


                      {user?.role ===
                        "admin" && (

                        <td>

                          <div className="action-buttons">

                            <button
                              className="edit-button"
                              onClick={() =>
                                handleEdit(
                                  student
                                )
                              }
                              title="Edit"
                            >
                              ✏️
                            </button>


                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  student
                                )
                              }
                              title="Hapus"
                            >
                              🗑️
                            </button>

                          </div>

                        </td>

                      )}

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={
                      user?.role ===
                      "admin"
                        ? "6"
                        : "5"
                    }
                    className="empty-data"
                  >

                    👨‍🎓 Belum ada
                    data murid.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

          )}

        </div>

      </div>


      {/* =========================
          MODAL
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal">

            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>

                  {editingStudent
                    ? "Edit Data Murid"
                    : "Tambah Murid"}

                </h2>

                <p>

                  {editingStudent
                    ? "Perbarui informasi murid."
                    : "Masukkan data murid baru."}

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


            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* NAMA */}

              <label>
                Nama Murid
              </label>

              <input
                type="text"
                name="name"
                placeholder="Contoh: Siti"
                value={
                  newStudent.name
                }
                onChange={
                  handleChange
                }
              />


              {/* JENIS KELAMIN */}

              <label>
                Jenis Kelamin
              </label>

              <select
                name="gender"
                value={
                  newStudent.gender
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>

              </select>


              {/* KELAS */}

              <label>
                Kelas
              </label>

              <input
                type="text"
                name="className"
                placeholder="Contoh: 6 SD"
                value={
                  newStudent.className
                }
                onChange={
                  handleChange
                }
              />


              {/* TUTOR */}

              <label>
                Tutor
              </label>

              <select
                name="tutorId"
                value={
                  newStudent.tutorId
                }
                onChange={(e) => {

                  const selectedTutor =
                    tutors.find(
                      (tutor) =>
                        tutor.id ===
                        e.target.value
                    );

                  setNewStudent({
                    ...newStudent,

                    tutorId:
                      e.target.value,

                    tutor:
                      selectedTutor
                        ?.name || "",
                  });

                }}
              >

                <option value="">
                  Pilih Tutor
                </option>

                {tutors.map(
                  (tutor) => (

                    <option
                      key={
                        tutor.id
                      }
                      value={
                        tutor.id
                      }
                    >
                      {
                        tutor.name
                      }
                    </option>

                  )
                )}

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

                  {editingStudent
                    ? "Simpan Perubahan"
                    : "Simpan Murid"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}


export default Students;