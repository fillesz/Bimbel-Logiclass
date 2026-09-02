import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";

import { getStudents } from "../data/studentStorage";
import { getAttendance } from "../data/attendanceStorage";
import { getPayments } from "../data/paymentStorage";


function Admin() {

  // =========================
  // DATA DASHBOARD
  // =========================
  // Semuanya dari Firestore, jadi diambil
  // lewat useEffect (async).

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {

      setIsLoading(true);

      try {

        const [
          studentsData,
          attendanceData,
          paymentsData,
        ] = await Promise.all([
          getStudents(),
          getAttendance(),
          getPayments(),
        ]);

        setStudents(studentsData);
        setAttendance(attendanceData);
        setPayments(paymentsData);

      } catch (error) {

        console.error(
          "Gagal memuat data dashboard admin:",
          error
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadData();

  }, []);


  // =========================
  // MURID AKTIF
  // =========================
  // Dianggap aktif kalau field status kosong
  // atau "Aktif" (sama seperti default di
  // TutorStudents.jsx: student.status || "Aktif")

  const activeStudents =
    students.filter(
      (student) =>
        !student.status ||
        student.status === "Aktif"
    ).length;


  // =========================
  // JUMLAH TUTOR
  // =========================
  // Belum ada collection "tutors" terpisah,
  // jadi dihitung dari tutorId unik yang ada
  // di data murid.

  const tutorCount = new Set(
    students
      .map((student) => student.tutorId)
      .filter(Boolean)
  ).size;


  // =========================
  // HADIR HARI INI
  // =========================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const presentToday =
    attendance.filter(
      (item) =>
        item.date === todayString &&
        item.attendance === "Hadir"
    ).length;


  // =========================
  // TOTAL PEMBAYARAN
  // =========================
  // Total semua pembayaran (all-time),
  // ditampilkan ringkas ala "Rp8,2 jt"
  // supaya konsisten sama tampilan lama.

  const totalPayment =
    payments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const formatCompactCurrency = (amount) => {

    if (amount >= 1000000) {

      return `Rp${(amount / 1000000)
        .toFixed(1)
        .replace(".", ",")} jt`;

    }

    if (amount >= 1000) {

      return `Rp${Math.round(
        amount / 1000
      )} rb`;

    }

    return `Rp${amount}`;

  };


  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="welcome">

          <p>
            Memuat data dashboard...
          </p>

        </div>

      </DashboardLayout>

    );

  }


  return (
    <DashboardLayout>

      <div className="welcome">

        <h1>Halo, Administrator 👋</h1>

        <p>
          Selamat datang di Dashboard LOGICLASS.
          Kelola seluruh aktivitas bimbel dari sini.
        </p>

      </div>

      <div className="cards">

        <StatCard
          icon="👨‍🎓"
          title="Murid Aktif"
          value={activeStudents}
        />

        <StatCard
          icon="👩‍🏫"
          title="Tutor"
          value={tutorCount}
        />

        <StatCard
          icon="📅"
          title="Hadir Hari Ini"
          value={presentToday}
        />

        <StatCard
          icon="💰"
          title="Pembayaran"
          value={formatCompactCurrency(totalPayment)}
        />

      </div>

    </DashboardLayout>
  );
}

export default Admin;