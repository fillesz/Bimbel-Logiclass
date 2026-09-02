import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

import { getStudents } from "../data/studentStorage";

import {
  getPackages,
  getRemainingMeetings,
  getPackageStatus,
  activatePackage,
} from "../data/packageStorage";

import {
  getPayments,
  addPayment,
  deletePayment,
} from "../data/paymentStorage";


function Payment() {

  // =========================
  // USER LOGIN
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // DATA MURID / PAKET / PEMBAYARAN
  // =========================
  // Sekarang semuanya diambil dari Firestore,
  // jadi tidak bisa langsung diisi di useState
  // seperti versi localStorage. Data awal kosong,
  // lalu diisi lewat useEffect di bawah.

  const [students, setStudents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  // =========================
  // MODAL
  // =========================

  const [showForm, setShowForm] = useState(false);


  // =========================
  // FORM PEMBAYARAN
  // =========================

  const [newPayment, setNewPayment] = useState({
    studentId: "",
    meetings: "",
    date: "",
    amount: "",
    method: "Transfer",
    note: "",
  });


  // =========================
  // AMBIL DATA AWAL DARI FIRESTORE
  // =========================

  useEffect(() => {

    const loadData = async () => {

      setIsLoading(true);

      try {

        const [
          latestStudents,
          latestPackages,
          latestPayments,
        ] = await Promise.all([
          getStudents(),
          getPackages(),
          getPayments(),
        ]);

        setStudents(latestStudents);
        setPackages(latestPackages);
        setPayments(latestPayments);

      } catch (error) {

        console.error(
          "Gagal memuat data pembayaran:",
          error
        );

        alert(
          "Gagal memuat data. Silakan refresh halaman."
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadData();

  }, []);


  // =========================
  // REFRESH DATA MURID
  // =========================

  const refreshStudents = async () => {

    const latestStudents = await getStudents();

    setStudents(latestStudents);

  };


  // =========================
  // BUKA FORM
  // =========================

  const handleOpenForm = async () => {

    // Ambil data murid terbaru
    await refreshStudents();

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

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount || 0));

  };


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
  // CARI MURID
  // =========================

  const getStudent = (studentId) => {

    return students.find(
      (student) => student.id === studentId
    );

  };


  // =========================
  // SIMPAN PEMBAYARAN
  // =========================
  // Beda dari versi localStorage: ID pembayaran
  // & pembuatan/reset paket sekarang ditangani di
  // paymentStorage.js dan packageStorage.js, jadi
  // di sini tinggal panggil fungsinya dan tunggu
  // hasilnya (async). Dibungkus try/catch supaya
  // kalau gagal di tengah jalan, user tahu dan bisa
  // coba lagi.

  const handleSavePayment = async (e) => {

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

      alert("Mohon lengkapi semua data pembayaran.");

      return;

    }


    const meetings = Number(newPayment.meetings);
    const amount = Number(newPayment.amount);


    if (isNaN(meetings) || meetings <= 0) {

      alert("Jumlah pertemuan harus lebih dari 0.");

      return;

    }


    if (isNaN(amount) || amount <= 0) {

      alert("Nominal pembayaran harus lebih dari 0.");

      return;

    }


    // =========================
    // CEK MURID
    // =========================

    const selectedStudent = students.find(
      (student) => student.id === newPayment.studentId
    );

    if (!selectedStudent) {

      alert("Data murid tidak ditemukan.");

      return;

    }


    // =========================
    // BUAT DATA PEMBAYARAN
    // =========================

    const paymentData = {
      studentId: newPayment.studentId,
      meetings: meetings,
      date: newPayment.date,
      amount: amount,
      method: newPayment.method,
      note: newPayment.note.trim(),
      status: "Lunas",
    };


    setIsSaving(true);

    try {

      // Simpan pembayaran (ID di-generate di paymentStorage)
      const updatedPayments = await addPayment(paymentData);

      setPayments(updatedPayments);


      // Buat / reset paket murid berdasarkan pembayaran ini
      await activatePackage(newPayment.studentId, {
        packageName: `Paket ${meetings} Pertemuan`,
        totalMeetings: meetings,
        startDate: newPayment.date,
      });

      const updatedPackages = await getPackages();

      setPackages(updatedPackages);


      handleCloseForm();

      alert(
        "Pembayaran berhasil disimpan dan paket murid telah diaktifkan."
      );

    } catch (error) {

      console.error("Gagal menyimpan pembayaran:", error);

      alert(
        "Terjadi kesalahan saat menyimpan pembayaran. Silakan coba lagi."
      );

    } finally {

      setIsSaving(false);

    }

  };


  // =========================
  // HAPUS PEMBAYARAN
  // =========================

  const handleDeletePayment = async (payment) => {

    const student = getStudent(payment.studentId);

    const confirmed = window.confirm(
      `Yakin ingin menghapus pembayaran ${
        student?.name || ""
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {

      const updatedPayments = await deletePayment(
        payment.id
      );

      setPayments(updatedPayments);

      alert("Data pembayaran berhasil dihapus.");

    } catch (error) {

      console.error("Gagal menghapus pembayaran:", error);

      alert("Terjadi kesalahan saat menghapus pembayaran.");

    }

  };


  // =========================
  // PEMBAYARAN YANG TERLIHAT
  // =========================

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
  // PAKET YANG TERLIHAT
  // =========================

  const visiblePackages = packages.filter((pkg) => {

    if (user?.role === "admin") {
      return true;
    }

    if (user?.role === "parent") {
      return pkg.studentId === user.studentId;
    }

    return false;

  });


  // =========================
  // STATISTIK PAKET
  // =========================

  const activePackages = visiblePackages.filter(
    (pkg) => getPackageStatus(pkg).status === "active"
  ).length;

  const warningPackages = visiblePackages.filter(
    (pkg) => getPackageStatus(pkg).status === "warning"
  ).length;

  const expiredPackages = visiblePackages.filter(
    (pkg) => getPackageStatus(pkg).status === "expired"
  ).length;


  // =========================
  // TOTAL PEMBAYARAN
  // =========================

  const totalPayment = visiblePayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );


  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {

    return (
      <DashboardLayout>
        <div className="payment-page">
          <p>Memuat data pembayaran...</p>
        </div>
      </DashboardLayout>
    );

  }


  // =========================
  // RENDER
  // =========================

  return (

    <DashboardLayout>

      <div className="payment-page">

        {/* HEADER */}
        <div className="page-header">

          <div>
            <h1>💰 Pembayaran</h1>
            <p>Kelola pembayaran dan paket belajar murid.</p>
          </div>

          {user?.role === "admin" && (
            <button className="add-button" onClick={handleOpenForm}>
              + Catat Pembayaran
            </button>
          )}

        </div>


        {/* SUMMARY */}
        <div className="payment-summary-grid">

          <div className="payment-summary-card">
            <div className="summary-icon">💰</div>
            <div>
              <span>Total Pembayaran</span>
              <strong>{formatCurrency(totalPayment)}</strong>
            </div>
          </div>

          <div className="payment-summary-card">
            <div className="summary-icon">🟢</div>
            <div>
              <span>Paket Aktif</span>
              <strong>{activePackages}</strong>
            </div>
          </div>

          <div className="payment-summary-card">
            <div className="summary-icon">🟡</div>
            <div>
              <span>Hampir Habis</span>
              <strong>{warningPackages}</strong>
            </div>
          </div>

          <div className="payment-summary-card">
            <div className="summary-icon">🔴</div>
            <div>
              <span>Paket Habis</span>
              <strong>{expiredPackages}</strong>
            </div>
          </div>

        </div>


        {/* DAFTAR PEMBAYARAN */}
        <div className="payment-table-card">

          <div className="table-title">
            <div>
              <h2>💳 Riwayat Pembayaran</h2>
              <p>Daftar transaksi pembayaran murid.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Murid</th>
                  <th>Jumlah Pertemuan</th>
                  <th>Nominal</th>
                  <th>Tanggal</th>
                  <th>Metode</th>
                  <th>Status</th>
                  {user?.role === "admin" && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>
                {visiblePayments.length > 0 ? (
                  visiblePayments.map((payment) => {

                    const student = getStudent(payment.studentId);

                    return (
                      <tr key={payment.id}>

                        <td>
                          <strong>
                            {student?.name || "Murid tidak ditemukan"}
                          </strong>
                          <br />
                          <small>{student?.className}</small>
                        </td>

                        <td>{payment.meetings} pertemuan</td>

                        <td>
                          <strong>{formatCurrency(payment.amount)}</strong>
                        </td>

                        <td>{formatDate(payment.date)}</td>

                        <td>{payment.method}</td>

                        <td>
                          <span className="payment-status success">
                            ✓ Lunas
                          </span>
                        </td>

                        {user?.role === "admin" && (
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => handleDeletePayment(payment)}
                              title="Hapus pembayaran"
                            >
                              🗑
                            </button>
                          </td>
                        )}

                      </tr>
                    );

                  })
                ) : (
                  <tr>
                    <td
                      colSpan={user?.role === "admin" ? "7" : "6"}
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


        {/* DAFTAR PAKET */}
        <div className="payment-table-card">

          <div className="table-title">
            <div>
              <h2>📦 Daftar Paket Murid</h2>
              <p>Status penggunaan paket belajar.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Murid</th>
                  <th>Paket</th>
                  <th>Digunakan</th>
                  <th>Sisa</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visiblePackages.length > 0 ? (
                  visiblePackages.map((pkg) => {

                    const student = getStudent(pkg.studentId);
                    const remaining = getRemainingMeetings(pkg);
                    const packageStatus = getPackageStatus(pkg);

                    return (
                      <tr key={pkg.studentId}>

                        <td>
                          <strong>
                            {student?.name || "Murid tidak ditemukan"}
                          </strong>
                          <br />
                          <small>{student?.className}</small>
                        </td>

                        <td>{pkg.packageName}</td>

                        <td>
                          {pkg.usedMeetings} / {pkg.totalMeetings}
                        </td>

                        <td>
                          <strong>{remaining}</strong> pertemuan
                        </td>

                        <td>
                          <span className={packageStatus.className}>
                            {packageStatus.label}
                          </span>
                        </td>

                      </tr>
                    );

                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-data">
                      📦 Belum ada paket murid.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>


      {/* MODAL INPUT PEMBAYARAN */}
      {showForm && (

        <div className="modal-overlay">
          <div className="student-modal payment-modal">

            <div className="modal-header">
              <div>
                <h2>💰 Input Pembayaran</h2>
                <p>Masukkan transaksi pembayaran murid.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={handleCloseForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePayment}>

              <label>Murid</label>
              <select
                value={newPayment.studentId}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    studentId: e.target.value,
                  })
                }
              >
                <option value="">Pilih murid</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.className}
                  </option>
                ))}
              </select>

              <label>Jumlah Pertemuan</label>
              <input
                type="number"
                min="1"
                placeholder="Contoh: 10"
                value={newPayment.meetings}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    meetings: e.target.value,
                  })
                }
              />

              <label>Tanggal</label>
              <input
                type="date"
                value={newPayment.date}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    date: e.target.value,
                  })
                }
              />

              <label>Nominal</label>
              <input
                type="number"
                min="1"
                placeholder="Contoh: 500000"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    amount: e.target.value,
                  })
                }
              />

              <label>Metode Pembayaran</label>
              <select
                value={newPayment.method}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    method: e.target.value,
                  })
                }
              >
                <option value="Transfer">Transfer</option>
                <option value="Cash">Cash</option>
                <option value="QRIS">QRIS</option>
              </select>

              <label>Catatan</label>
              <textarea
                rows="3"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={newPayment.note}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    note: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseForm}
                  disabled={isSaving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Pembayaran"}
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