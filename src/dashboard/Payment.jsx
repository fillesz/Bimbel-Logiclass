import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

import {
  getStudents,
} from "../data/studentStorage";

import {
  getPackages,
  savePackages,
  getRemainingMeetings,
  getPackageStatus,
} from "../data/packageStorage";


function Payment() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID
  // =========================

  const [students, setStudents] =
    useState(() => getStudents());


  // =========================
  // DATA PAKET
  // =========================

  const [packages, setPackages] =
    useState(() => getPackages());


  // =========================
  // DATA PEMBAYARAN
  // =========================

  const [payments, setPayments] =
    useState(() => {

      const savedPayments =
        localStorage.getItem("payments");

      if (savedPayments) {

        try {

          return JSON.parse(
            savedPayments
          );

        } catch (error) {

          console.error(
            "Data pembayaran rusak:",
            error
          );

          return [];
        }
      }

      return [];

    });


  // =========================
  // MODAL
  // =========================

  const [showForm, setShowForm] =
    useState(false);


  // =========================
  // FORM PEMBAYARAN
  // =========================

  const [newPayment, setNewPayment] =
    useState({

      studentId: "",
      meetings: "",
      date: "",
      amount: "",
      method: "Transfer",
      note: "",

    });


  // =========================
  // REFRESH DATA MURID
  // =========================

  const refreshStudents = () => {

    const latestStudents =
      getStudents();

    setStudents(
      latestStudents
    );

  };


  // =========================
  // BUKA FORM
  // =========================

  const handleOpenForm = () => {

    // Ambil data murid terbaru
    refreshStudents();

    setNewPayment({

      studentId: "",
      meetings: "",
      date: "",
      amount: "",
      method: "Transfer",
      note: "",

    });

    setShowForm(true);

  };


  // =========================
  // TUTUP FORM
  // =========================

  const handleCloseForm = () => {

    setShowForm(false);

    setNewPayment({

      studentId: "",
      meetings: "",
      date: "",
      amount: "",
      method: "Transfer",
      note: "",

    });

  };


  // =========================
  // FORMAT RUPIAH
  // =========================

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }
    ).format(
      Number(amount || 0)
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
  // CARI MURID
  // =========================

  const getStudent = (studentId) => {

    return students.find(
      (student) =>
        student.id === studentId
    );

  };


  // =========================
  // GENERATE ID PEMBAYARAN
  // =========================

  const generatePaymentId = () => {

    if (payments.length === 0) {
      return "PAY001";
    }

    const numbers =
      payments.map((payment) => {

        const number =
          parseInt(
            String(payment.id)
              .replace("PAY", ""),
            10
          );

        return isNaN(number)
          ? 0
          : number;

      });

    const highestNumber =
      Math.max(...numbers);

    return `PAY${String(
      highestNumber + 1
    ).padStart(3, "0")}`;

  };


  // =========================
  // GENERATE ID PAKET
  // =========================

  const generatePackageId = (
    currentPackages
  ) => {

    if (currentPackages.length === 0) {
      return "PKG001";
    }

    const numbers =
      currentPackages.map((pkg) => {

        const number =
          parseInt(
            String(pkg.id)
              .replace("PKG", ""),
            10
          );

        return isNaN(number)
          ? 0
          : number;

      });

    const highestNumber =
      Math.max(...numbers);

    return `PKG${String(
      highestNumber + 1
    ).padStart(3, "0")}`;

  };


  // =========================
  // SIMPAN PEMBAYARAN
  // =========================

  const handleSavePayment = (e) => {

    e.preventDefault();


    // =========================
    // VALIDASI
    // =========================

    if (

      !newPayment.studentId ||

      !newPayment.meetings ||

      !newPayment.date ||

      !newPayment.amount

    ) {

      alert(
        "Mohon lengkapi semua data pembayaran."
      );

      return;

    }


    const meetings =
      Number(
        newPayment.meetings
      );

    const amount =
      Number(
        newPayment.amount
      );


    if (

      isNaN(meetings) ||

      meetings <= 0

    ) {

      alert(
        "Jumlah pertemuan harus lebih dari 0."
      );

      return;

    }


    if (

      isNaN(amount) ||

      amount <= 0

    ) {

      alert(
        "Nominal pembayaran harus lebih dari 0."
      );

      return;

    }


    // =========================
    // CEK MURID
    // =========================

    const selectedStudent =
      students.find(
        (student) =>
          student.id ===
          newPayment.studentId
      );


    if (!selectedStudent) {

      alert(
        "Data murid tidak ditemukan."
      );

      return;

    }


    // =========================
    // BUAT DATA PEMBAYARAN
    // =========================

    const paymentData = {

      id:
        generatePaymentId(),

      studentId:
        newPayment.studentId,

      meetings:
        meetings,

      date:
        newPayment.date,

      amount:
        amount,

      method:
        newPayment.method,

      note:
        newPayment.note.trim(),

      status:
        "Lunas",

    };


    // =========================
    // SIMPAN PEMBAYARAN
    // =========================

    const updatedPayments = [

      ...payments,

      paymentData,

    ];


    setPayments(
      updatedPayments
    );


    localStorage.setItem(

      "payments",

      JSON.stringify(
        updatedPayments
      )

    );


    // =========================
    // UPDATE / BUAT PAKET
    // =========================

    const packageIndex =
      packages.findIndex(
        (pkg) =>
          pkg.studentId ===
          newPayment.studentId
      );


    let updatedPackages;


    // =========================
    // JIKA SUDAH ADA PAKET
    // =========================

    if (packageIndex !== -1) {

      updatedPackages =
        packages.map(
          (pkg, index) => {

            if (
              index !== packageIndex
            ) {
              return pkg;
            }

            return {

              ...pkg,

              packageName:
                `Paket ${meetings} Pertemuan`,

              totalMeetings:
                meetings,

              usedMeetings:
                0,

              startDate:
                newPayment.date,

              status:
                "active",

            };

          }
        );

    }


    // =========================
    // JIKA BELUM ADA PAKET
    // =========================

    else {

      const newPackage = {

        id:
          generatePackageId(
            packages
          ),

        studentId:
          newPayment.studentId,

        packageName:
          `Paket ${meetings} Pertemuan`,

        totalMeetings:
          meetings,

        usedMeetings:
          0,

        startDate:
          newPayment.date,

        endDate:
          "",

        status:
          "active",

      };


      updatedPackages = [

        ...packages,

        newPackage,

      ];

    }


    // =========================
    // SIMPAN PAKET
    // =========================

    setPackages(
      updatedPackages
    );


    savePackages(
      updatedPackages
    );


    // =========================
    // RESET
    // =========================

    handleCloseForm();


    alert(
      "Pembayaran berhasil disimpan dan paket murid telah diaktifkan."
    );

  };


  // =========================
  // HAPUS PEMBAYARAN
  // =========================

  const handleDeletePayment = (
    payment
  ) => {

    const student =
      getStudent(
        payment.studentId
      );


    const confirmed =
      window.confirm(

        `Yakin ingin menghapus pembayaran ${
          student?.name || ""
        }?`

      );


    if (!confirmed) {
      return;
    }


    const updatedPayments =
      payments.filter(
        (item) =>
          item.id !== payment.id
      );


    setPayments(
      updatedPayments
    );


    localStorage.setItem(

      "payments",

      JSON.stringify(
        updatedPayments
      )

    );


    alert(
      "Data pembayaran berhasil dihapus."
    );

  };


  // =========================
  // PEMBAYARAN YANG TERLIHAT
  // =========================

  const visiblePayments =
    payments.filter(
      (payment) => {

        if (
          user?.role === "admin"
        ) {
          return true;
        }


        if (
          user?.role === "parent"
        ) {

          return (
            payment.studentId ===
            user.studentId
          );

        }


        return false;

      }
    );


  // =========================
  // PAKET YANG TERLIHAT
  // =========================

  const visiblePackages =
    packages.filter(
      (pkg) => {

        if (
          user?.role === "admin"
        ) {
          return true;
        }


        if (
          user?.role === "parent"
        ) {

          return (
            pkg.studentId ===
            user.studentId
          );

        }


        return false;

      }
    );


  // =========================
  // STATISTIK PAKET
  // =========================

  const activePackages =
    visiblePackages.filter(
      (pkg) =>
        getPackageStatus(pkg)
          .status === "active"
    ).length;


  const warningPackages =
    visiblePackages.filter(
      (pkg) =>
        getPackageStatus(pkg)
          .status === "warning"
    ).length;


  const expiredPackages =
    visiblePackages.filter(
      (pkg) =>
        getPackageStatus(pkg)
          .status === "expired"
    ).length;


  // =========================
  // TOTAL PEMBAYARAN
  // =========================

  const totalPayment =
    visiblePayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),

      0
    );


  // =========================
  // RENDER
  // =========================

  return (

    <DashboardLayout>

      <div className="payment-page">


        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              💰 Pembayaran
            </h1>

            <p>
              Kelola pembayaran dan paket belajar murid.
            </p>

          </div>


          {user?.role === "admin" && (

            <button
              className="add-button"
              onClick={
                handleOpenForm
              }
            >

              + Catat Pembayaran

            </button>

          )}

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="payment-summary-grid">


          <div className="payment-summary-card">

            <div className="summary-icon">
              💰
            </div>

            <div>

              <span>
                Total Pembayaran
              </span>

              <strong>
                {formatCurrency(
                  totalPayment
                )}
              </strong>

            </div>

          </div>


          <div className="payment-summary-card">

            <div className="summary-icon">
              🟢
            </div>

            <div>

              <span>
                Paket Aktif
              </span>

              <strong>
                {activePackages}
              </strong>

            </div>

          </div>


          <div className="payment-summary-card">

            <div className="summary-icon">
              🟡
            </div>

            <div>

              <span>
                Hampir Habis
              </span>

              <strong>
                {warningPackages}
              </strong>

            </div>

          </div>


          <div className="payment-summary-card">

            <div className="summary-icon">
              🔴
            </div>

            <div>

              <span>
                Paket Habis
              </span>

              <strong>
                {expiredPackages}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================
            DAFTAR PEMBAYARAN
        ========================= */}

        <div className="payment-table-card">

          <div className="table-title">

            <div>

              <h2>
                💳 Riwayat Pembayaran
              </h2>

              <p>
                Daftar transaksi pembayaran murid.
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
                    Jumlah Pertemuan
                  </th>

                  <th>
                    Nominal
                  </th>

                  <th>
                    Tanggal
                  </th>

                  <th>
                    Metode
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

                {visiblePayments.length >
                0 ? (

                  visiblePayments.map(
                    (payment) => {

                      const student =
                        getStudent(
                          payment.studentId
                        );


                      return (

                        <tr
                          key={
                            payment.id
                          }
                        >

                          {/* MURID */}

                          <td>

                            <strong>

                              {
                                student?.name ||
                                "Murid tidak ditemukan"
                              }

                            </strong>

                            <br />

                            <small>

                              {
                                student?.className
                              }

                            </small>

                          </td>


                          {/* PERTEMUAN */}

                          <td>

                            {
                              payment.meetings
                            } pertemuan

                          </td>


                          {/* NOMINAL */}

                          <td>

                            <strong>

                              {formatCurrency(
                                payment.amount
                              )}

                            </strong>

                          </td>


                          {/* TANGGAL */}

                          <td>

                            {formatDate(
                              payment.date
                            )}

                          </td>


                          {/* METODE */}

                          <td>

                            {
                              payment.method
                            }

                          </td>


                          {/* STATUS */}

                          <td>

                            <span className="payment-status success">

                              ✓ Lunas

                            </span>

                          </td>


                          {/* AKSI */}

                          {user?.role ===
                            "admin" && (

                            <td>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDeletePayment(
                                    payment
                                  )
                                }
                                title="Hapus pembayaran"
                              >

                                🗑

                              </button>

                            </td>

                          )}

                        </tr>

                      );

                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={
                        user?.role === "admin"
                          ? "7"
                          : "6"
                      }
                      className="empty-data"
                    >

                      💳 Belum ada data pembayaran.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =========================
            DAFTAR PAKET
        ========================= */}

        <div className="payment-table-card">

          <div className="table-title">

            <div>

              <h2>
                📦 Daftar Paket Murid
              </h2>

              <p>
                Status penggunaan paket belajar.
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
                    Paket
                  </th>

                  <th>
                    Digunakan
                  </th>

                  <th>
                    Sisa
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {visiblePackages.length >
                0 ? (

                  visiblePackages.map(
                    (pkg) => {

                      const student =
                        getStudent(
                          pkg.studentId
                        );


                      const remaining =
                        getRemainingMeetings(
                          pkg
                        );


                      const packageStatus =
                        getPackageStatus(
                          pkg
                        );


                      return (

                        <tr
                          key={
                            pkg.id
                          }
                        >

                          {/* MURID */}

                          <td>

                            <strong>

                              {
                                student?.name ||
                                "Murid tidak ditemukan"
                              }

                            </strong>

                            <br />

                            <small>

                              {
                                student?.className
                              }

                            </small>

                          </td>


                          {/* PAKET */}

                          <td>

                            {
                              pkg.packageName
                            }

                          </td>


                          {/* DIGUNAKAN */}

                          <td>

                            {
                              pkg.usedMeetings
                            }

                            {" / "}

                            {
                              pkg.totalMeetings
                            }

                          </td>


                          {/* SISA */}

                          <td>

                            <strong>

                              {remaining}

                            </strong>

                            {" pertemuan"}

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                packageStatus.className
                              }
                            >

                              {packageStatus.label}

                            </span>

                          </td>

                        </tr>

                      );

                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-data"
                    >

                      📦 Belum ada paket murid.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>


      {/* =========================
          MODAL INPUT PEMBAYARAN
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal payment-modal">


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  💰 Input Pembayaran
                </h2>

                <p>
                  Masukkan transaksi pembayaran murid.
                </p>

              </div>


              <button
                type="button"
                className="close-button"
                onClick={
                  handleCloseForm
                }
              >

                ×

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleSavePayment
              }
            >


              {/* MURID */}

              <label>
                Murid
              </label>

              <select
                value={
                  newPayment.studentId
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    studentId:
                      e.target.value,

                  })
                }
              >

                <option value="">
                  Pilih murid
                </option>


                {students.map(
                  (student) => (

                    <option
                      key={
                        student.id
                      }
                      value={
                        student.id
                      }
                    >

                      {student.name}
                      {" - "}
                      {student.className}

                    </option>

                  )
                )}

              </select>


              {/* JUMLAH PERTEMUAN */}

              <label>
                Jumlah Pertemuan
              </label>

              <input
                type="number"
                min="1"
                placeholder="Contoh: 10"
                value={
                  newPayment.meetings
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    meetings:
                      e.target.value,

                  })
                }
              />


              {/* TANGGAL */}

              <label>
                Tanggal
              </label>

              <input
                type="date"
                value={
                  newPayment.date
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    date:
                      e.target.value,

                  })
                }
              />


              {/* NOMINAL */}

              <label>
                Nominal
              </label>

              <input
                type="number"
                min="1"
                placeholder="Contoh: 500000"
                value={
                  newPayment.amount
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    amount:
                      e.target.value,

                  })
                }
              />


              {/* METODE */}

              <label>
                Metode Pembayaran
              </label>

              <select
                value={
                  newPayment.method
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    method:
                      e.target.value,

                  })
                }
              >

                <option value="Transfer">
                  Transfer
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="QRIS">
                  QRIS
                </option>

              </select>


              {/* CATATAN */}

              <label>
                Catatan
              </label>

              <textarea
                rows="3"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={
                  newPayment.note
                }
                onChange={(e) =>
                  setNewPayment({

                    ...newPayment,

                    note:
                      e.target.value,

                  })
                }
              />


              {/* BUTTON */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    handleCloseForm
                  }
                >

                  Batal

                </button>


                <button
                  type="submit"
                  className="save-button"
                >

                  Simpan Pembayaran

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>

  );

}


export default Payment;