import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

import { studentData } from "../data/studentData";

import {
  getPackages,
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
  // DATA PACKAGE
  // =========================

  const [packages] = useState(() => {

    return getPackages();

  });

  // =========================
  // DATA PEMBAYARAN
  // =========================

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem("logiclass_payments");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Gagal membaca data pembayaran:", error);
      return [];
    }
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paymentForm, setPaymentForm] = useState(() => ({
    studentId: "",
    packageId: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amount: "",
    method: "Transfer",
    note: "",
  }));

  // Simpan otomatis setiap ada perubahan pembayaran
  useEffect(() => {
    localStorage.setItem(
      "logiclass_payments",
      JSON.stringify(payments)
    );
  }, [payments]);

  const formatRupiah = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const openPaymentModal = () => {
    setPaymentForm({
      studentId: "",
      packageId: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amount: "",
      method: "Transfer",
      note: "",
    });

    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "studentId"
        ? { packageId: "" }
        : {}),
    }));
  };

  const handleSavePayment = (event) => {
    event.preventDefault();

    if (
      !paymentForm.studentId ||
      !paymentForm.packageId ||
      !paymentForm.paymentDate ||
      !paymentForm.amount ||
      Number(paymentForm.amount) <= 0
    ) {
      alert("Lengkapi data pembayaran terlebih dahulu.");
      return;
    }

    const selectedStudent = getStudent(
      paymentForm.studentId
    );

    const selectedPackage = packages.find(
      (packageItem) =>
        packageItem.id === paymentForm.packageId
    );

    if (!selectedStudent || !selectedPackage) {
      alert("Data murid atau paket tidak ditemukan.");
      return;
    }

    const newPayment = {
      id: `PAY-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.packageName,
      paymentDate: paymentForm.paymentDate,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      note: paymentForm.note.trim(),
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowPaymentModal(false);

    alert(
      `Pembayaran ${formatRupiah(
        newPayment.amount
      )} untuk ${newPayment.studentName} berhasil disimpan.`
    );
  };

  const deletePayment = (paymentId) => {
    const confirmed = window.confirm(
      "Hapus data pembayaran ini?"
    );

    if (!confirmed) {
      return;
    }

    setPayments((prev) =>
      prev.filter(
        (payment) => payment.id !== paymentId
      )
    );
  };

  const visiblePayments = payments.filter((payment) => {
    if (user?.role === "admin") {
      return true;
    }

    if (user?.role === "parent") {
      return payment.studentId === user.studentId;
    }

    return false;
  });


  // =========================
  // FORMAT TANGGAL
  // =========================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    const parts = date.split("-");


    if (parts.length !== 3) {

      return date;

    }


    return `${parts[2]}-${parts[1]}-${parts[0]}`;

  };


  // =========================
  // CARI DATA MURID
  // =========================

  const getStudent = (studentId) => {

    return studentData.find(
      (student) =>
        student.id === studentId
    );

  };


  // =========================
  // PACKAGE YANG BOLEH DILIHAT
  // =========================

  const visiblePackages =
    packages.filter((packageItem) => {


      // =========================
      // ADMIN
      // =========================

      if (user?.role === "admin") {

        return true;

      }


      // =========================
      // PARENT
      // =========================

      if (user?.role === "parent") {

        return (
          packageItem.studentId ===
          user.studentId
        );

      }


      return false;

    });


  // =========================
  // PARENT VIEW
  // =========================

  if (user?.role === "parent") {


    const packageItem =
      visiblePackages[0];


    const child =
      getStudent(
        user?.studentId
      );


    // =========================
    // JIKA BELUM ADA PAKET
    // =========================

    if (!packageItem) {

      return (

        <DashboardLayout>

          <div className="payment-page">


            <div className="page-header">

              <div>

                <h1>
                  💰 Paket Belajar
                </h1>

                <p>
                  Informasi paket belajar anak.
                </p>

              </div>

            </div>


            <div className="payment-empty">

              <div className="payment-empty-icon">
                📦
              </div>


              <h2>
                Belum Ada Paket
              </h2>


              <p>

                Saat ini belum ada paket belajar
                yang terhubung dengan akun anak Anda.

              </p>


              <span>

                Silakan hubungi administrator
                untuk informasi lebih lanjut.

              </span>

            </div>


          </div>

        </DashboardLayout>

      );

    }


    // =========================
    // HITUNG PACKAGE
    // =========================

    const remaining =
      getRemainingMeetings(
        packageItem
      );


    const packageStatus =
      getPackageStatus(
        packageItem
      );


    const progress =
      packageItem.totalMeetings > 0
        ? (
            packageItem.usedMeetings /
            packageItem.totalMeetings
          ) * 100
        : 0;


    return (

      <DashboardLayout>


        <div className="payment-page">


          {/* =========================
              HEADER
          ========================= */}

          <div className="page-header">

            <div>

              <h1>
                💰 Paket Belajar
              </h1>

              <p>
                Pantau penggunaan paket belajar anak.
              </p>

            </div>

          </div>


          {/* =========================
              CHILD INFO
          ========================= */}

          <div className="payment-child-card">


            <div className="payment-child-avatar">
              👨‍🎓
            </div>


            <div className="payment-child-info">

              <span>
                Paket untuk
              </span>


              <h2>
                {child?.name || "Murid"}
              </h2>


              <p>

                {child?.id}

                {" • "}

                {child?.className}

              </p>

            </div>


            <div
              className={`package-status-badge ${packageStatus.className}`}
            >

              {packageStatus.color === "green"
                ? "🟢"
                : packageStatus.color === "yellow"
                ? "🟡"
                : "🔴"}

              {" "}

              {packageStatus.label}

            </div>


          </div>


          {/* =========================
              PACKAGE CARD
          ========================= */}

          <div
            className={`payment-package-card ${packageStatus.className}`}
          >


            {/* HEADER */}

            <div className="package-card-header">


              <div>

                <span>
                  Paket Belajar
                </span>


                <h2>
                  {packageItem.packageName}
                </h2>

              </div>


              <div className="package-status-large">

                {packageStatus.color === "green"
                  ? "🟢"
                  : packageStatus.color === "yellow"
                  ? "🟡"
                  : "🔴"}

              </div>


            </div>


            {/* PACKAGE SUMMARY */}

            <div className="package-meeting-summary">


              <div>

                <span>
                  Total Pertemuan
                </span>

                <strong>
                  {packageItem.totalMeetings}
                </strong>

              </div>


              <div>

                <span>
                  Sudah Digunakan
                </span>

                <strong>
                  {packageItem.usedMeetings}
                </strong>

              </div>


              <div className="remaining-meeting">

                <span>
                  Sisa Pertemuan
                </span>

                <strong>
                  {remaining}
                </strong>

              </div>


            </div>


            {/* PROGRESS */}

            <div className="package-progress-section">


              <div className="package-progress-header">

                <span>
                  Penggunaan Paket
                </span>


                <strong>
                  {Math.round(progress)}%
                </strong>

              </div>


              <div className="package-progress-bar">

                <div
                  className={`package-progress-fill ${packageStatus.className}`}
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


            </div>


            {/* PERIOD */}

            <div className="package-period">


              <div>

                <span>
                  📅 Mulai
                </span>

                <strong>

                  {formatDate(
                    packageItem.startDate
                  )}

                </strong>

              </div>


              <div className="package-period-line">

                →

              </div>


              <div>

                <span>
                  🏁 Berakhir
                </span>

                <strong>

                  {formatDate(
                    packageItem.endDate
                  )}

                </strong>

              </div>


            </div>


            {/* STATUS MESSAGE */}

            <div
              className={`package-message ${packageStatus.className}`}
            >

              {packageStatus.status === "active" && (

                <>
                  🎉 Paket masih aktif.
                  Anak Anda masih memiliki{" "}

                  <strong>
                    {remaining} pertemuan
                  </strong>

                  .
                </>

              )}


              {packageStatus.status === "warning" && (

                <>
                  ⚠️ Paket hampir habis.
                  Tersisa{" "}

                  <strong>
                    1 pertemuan
                  </strong>

                  . Segera lakukan perpanjangan paket.
                </>

              )}


              {packageStatus.status === "expired" && (

                <>
                  🚨 Paket sudah habis.
                  Silakan hubungi administrator
                  untuk memperpanjang paket belajar.
                </>

              )}

            </div>


          </div>


        </div>


      </DashboardLayout>

    );

  }


  // =========================
  // ADMIN VIEW
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
              💰 Pembayaran & Paket
            </h1>

            <p>
              Pantau status paket belajar seluruh murid.
            </p>

          </div>


          <div
            className="payment-header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >

            <div className="payment-header-info">

              <span>
                Total Paket
              </span>

              <strong>
                {visiblePackages.length}
              </strong>

            </div>

            <button
              type="button"
              onClick={openPaymentModal}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "12px 18px",
                background: "#111827",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              + Input Pembayaran
            </button>

          </div>


        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="payment-summary">


          {/* AKTIF */}

          <div className="payment-summary-card">

            <span className="payment-summary-icon">
              🟢
            </span>


            <div>

              <span>
                Paket Aktif
              </span>


              <strong>

                {
                  visiblePackages.filter(
                    (packageItem) =>
                      getPackageStatus(
                        packageItem
                      ).status === "active"
                  ).length
                }

              </strong>

            </div>

          </div>


          {/* HAMPIR HABIS */}

          <div className="payment-summary-card">

            <span className="payment-summary-icon">
              🟡
            </span>


            <div>

              <span>
                Hampir Habis
              </span>


              <strong>

                {
                  visiblePackages.filter(
                    (packageItem) =>
                      getPackageStatus(
                        packageItem
                      ).status === "warning"
                  ).length
                }

              </strong>

            </div>

          </div>


          {/* HABIS */}

          <div className="payment-summary-card">

            <span className="payment-summary-icon">
              🔴
            </span>


            <div>

              <span>
                Paket Habis
              </span>


              <strong>

                {
                  visiblePackages.filter(
                    (packageItem) =>
                      getPackageStatus(
                        packageItem
                      ).status === "expired"
                  ).length
                }

              </strong>

            </div>

          </div>


        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="payment-table-card">


          <div className="table-title">

            <div>

              <h2>
                Daftar Paket Murid
              </h2>


              <p>
                Status penggunaan paket belajar.
              </p>

            </div>

          </div>


          <div className="table-wrapper">


            <table className="payment-table">


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
                    Periode
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>


                {visiblePackages.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="empty-data"
                    >

                      Belum ada data paket.

                    </td>

                  </tr>

                ) : (

                  visiblePackages.map(
                    (packageItem) => {


                      const student =
                        getStudent(
                          packageItem.studentId
                        );


                      const remaining =
                        getRemainingMeetings(
                          packageItem
                        );


                      const packageStatus =
                        getPackageStatus(
                          packageItem
                        );


                      return (

                        <tr
                          key={packageItem.id}
                        >


                          {/* MURID */}

                          <td>

                            <div className="payment-student">

                              <div className="payment-student-avatar">
                                👨‍🎓
                              </div>


                              <div>

                                <strong>
                                  {student?.name ||
                                    "Murid tidak ditemukan"}
                                </strong>


                                <span>

                                  {student?.className ||
                                    "-"}

                                </span>

                              </div>

                            </div>

                          </td>


                          {/* PAKET */}

                          <td>

                            <strong>

                              {packageItem.packageName}

                            </strong>


                            <span className="payment-package-id">

                              {packageItem.id}

                            </span>

                          </td>


                          {/* DIGUNAKAN */}

                          <td>

                            <strong>

                              {packageItem.usedMeetings}

                              {" / "}

                              {packageItem.totalMeetings}

                            </strong>

                          </td>


                          {/* SISA */}

                          <td>

                            <strong
                              className={
                                packageStatus.className
                              }
                            >

                              {remaining}

                            </strong>


                            <span>
                              pertemuan
                            </span>

                          </td>


                          {/* PERIODE */}

                          <td>

                            <div className="payment-date">

                              {formatDate(
                                packageItem.startDate
                              )}

                              {" - "}

                              {formatDate(
                                packageItem.endDate
                              )}

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`package-status-badge ${packageStatus.className}`}
                            >

                              {packageStatus.color === "green"
                                ? "🟢"
                                : packageStatus.color === "yellow"
                                ? "🟡"
                                : "🔴"}

                              {" "}

                              {packageStatus.label}

                            </span>

                          </td>


                        </tr>

                      );

                    }
                  )

                )}


              </tbody>


            </table>


          </div>


        </div>


        {/* =========================
            RIWAYAT PEMBAYARAN
        ========================= */}

        <div
          className="payment-table-card"
          style={{ marginTop: "24px" }}
        >

          <div
            className="table-title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >

            <div>

              <h2>
                Riwayat Pembayaran
              </h2>

              <p>
                Data pembayaran tersimpan otomatis dan
                langsung muncul setelah disimpan.
              </p>

            </div>

            <strong style={{ fontSize: "18px" }}>
              {visiblePayments.length} transaksi
            </strong>

          </div>


          <div className="table-wrapper">

            <table className="payment-table">

              <thead>

                <tr>

                  <th>
                    Tanggal
                  </th>

                  <th>
                    Murid
                  </th>

                  <th>
                    Paket
                  </th>

                  <th>
                    Nominal
                  </th>

                  <th>
                    Metode
                  </th>

                  <th>
                    Catatan
                  </th>

                  <th>
                    Aksi
                  </th>

                </tr>

              </thead>


              <tbody>

                {visiblePayments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="empty-data"
                    >
                      Belum ada pembayaran.
                    </td>

                  </tr>

                ) : (

                  visiblePayments.map((payment) => (

                    <tr key={payment.id}>

                      <td>
                        {formatDate(payment.paymentDate)}
                      </td>

                      <td>
                        <strong>
                          {payment.studentName}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {payment.packageName}
                        </strong>

                        <span className="payment-package-id">
                          {payment.packageId}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatRupiah(payment.amount)}
                        </strong>
                      </td>

                      <td>
                        {payment.method}
                      </td>

                      <td>
                        {payment.note || "-"}
                      </td>

                      <td>
                        {user?.role === "admin" && (
                          <button
                            type="button"
                            onClick={() =>
                              deletePayment(payment.id)
                            }
                            style={{
                              border: "none",
                              borderRadius: "8px",
                              padding: "7px 10px",
                              background: "#fee2e2",
                              color: "#dc2626",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Hapus
                          </button>
                        )}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =========================
            MODAL INPUT PEMBAYARAN
        ========================= */}

        {showPaymentModal && (

          <div
            onClick={closePaymentModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 9999,
            }}
          >

            <div
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                width: "100%",
                maxWidth: "560px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "18px",
                padding: "24px",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >

                <div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                    }}
                  >
                    Input Pembayaran
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Masukkan transaksi pembayaran murid.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>

              </div>


              <form onSubmit={handleSavePayment}>

                <div style={{ marginBottom: "16px" }}>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontWeight: 700,
                    }}
                  >
                    Murid
                  </label>

                  <select
                    name="studentId"
                    value={paymentForm.studentId}
                    onChange={handlePaymentChange}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >

                    <option value="">
                      Pilih murid
                    </option>

                    {studentData.map((student) => (

                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.name} -{" "}
                        {student.className || "-"}
                      </option>

                    ))}

                  </select>

                </div>


                <div style={{ marginBottom: "16px" }}>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontWeight: 700,
                    }}
                  >
                    Paket
                  </label>

                  <select
                    name="packageId"
                    value={paymentForm.packageId}
                    onChange={handlePaymentChange}
                    required
                    disabled={!paymentForm.studentId}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      background: !paymentForm.studentId
                        ? "#f3f4f6"
                        : "#ffffff",
                    }}
                  >

                    <option value="">
                      {!paymentForm.studentId
                        ? "Pilih murid terlebih dahulu"
                        : "Pilih paket"}
                    </option>

                    {visiblePackages
                      .filter(
                        (packageItem) =>
                          packageItem.studentId ===
                          paymentForm.studentId
                      )
                      .map((packageItem) => (

                        <option
                          key={packageItem.id}
                          value={packageItem.id}
                        >
                          {packageItem.packageName} -{" "}
                          {packageItem.id}
                        </option>

                      ))}

                  </select>

                </div>


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "14px",
                  }}
                >

                  <div style={{ marginBottom: "16px" }}>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontWeight: 700,
                      }}
                    >
                      Tanggal
                    </label>

                    <input
                      type="date"
                      name="paymentDate"
                      value={
                        paymentForm.paymentDate
                      }
                      onChange={handlePaymentChange}
                      required
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />

                  </div>


                  <div style={{ marginBottom: "16px" }}>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontWeight: 700,
                      }}
                    >
                      Nominal
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={paymentForm.amount}
                      onChange={handlePaymentChange}
                      placeholder="Contoh: 150000"
                      min="1"
                      required
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />

                  </div>

                </div>


                <div style={{ marginBottom: "16px" }}>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontWeight: 700,
                    }}
                  >
                    Metode Pembayaran
                  </label>

                  <select
                    name="method"
                    value={paymentForm.method}
                    onChange={handlePaymentChange}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
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

                </div>


                <div style={{ marginBottom: "22px" }}>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontWeight: 700,
                    }}
                  >
                    Catatan
                  </label>

                  <textarea
                    name="note"
                    value={paymentForm.note}
                    onChange={handlePaymentChange}
                    placeholder="Opsional"
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      resize: "vertical",
                    }}
                  />

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >

                  <button
                    type="button"
                    onClick={closePaymentModal}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      padding: "11px 18px",
                      background: "#ffffff",
                      color: "#374151",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      padding: "11px 18px",
                      background: "#111827",
                      color: "#ffffff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Simpan Pembayaran
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


      </div>


    </DashboardLayout>

  );

}


export default Payment;