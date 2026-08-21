import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

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


          <div className="payment-header-info">

            <span>
              Total Paket
            </span>

            <strong>
              {visiblePackages.length}
            </strong>

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


      </div>


    </DashboardLayout>

  );

}


export default Payment;