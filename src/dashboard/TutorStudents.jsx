import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getStudents } from "../data/studentStorage";


function TutorStudents() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();


  // =========================
  // DATA MURID
  // =========================
  // getStudents() sekarang async (Firestore),
  // jadi diambil lewat useEffect, bukan
  // langsung di useState seperti sebelumnya.

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] =
    useState("");


  useEffect(() => {

    const loadStudents = async () => {

      setIsLoading(true);

      try {

        const data = await getStudents();

        setStudents(data);

      } catch (error) {

        console.error(
          "Gagal memuat data murid:",
          error
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadStudents();

  }, []);


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
  // SEARCH
  // =========================

  const filteredStudents =
    myStudents.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="students-page">

          <div className="empty-data">
            Memuat data murid...
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

      <div className="students-page">


        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              Murid Saya 👨‍🎓
            </h1>

            <p>
              Daftar murid yang sedang
              kamu ajar.
            </p>

          </div>

        </div>


        {/* =========================
            INFO
        ========================= */}

        <div className="student-info">

          <strong>
            {filteredStudents.length}
          </strong>

          <span>
            murid yang kamu ajar
          </span>

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

          <table>

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  ID
                </th>

                <th>
                  Nama Murid
                </th>

                <th>
                  Kelas
                </th>

                <th>
                  Status
                </th>

                <th>
                  Aksi
                </th>

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
                        {student.id}
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

                        <span className="status-active">

                          {
                            student.status ||
                            "Aktif"
                          }

                        </span>

                      </td>


                      <td>

                        <button
                          className="view-button"
                          onClick={() =>
                            navigate(
                              `/tutor/murid/${student.id}`
                            )
                          }
                        >

                          Lihat Laporan

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-data"
                  >

                    👨‍🎓 Belum ada murid
                    yang kamu ajar.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}


export default TutorStudents;