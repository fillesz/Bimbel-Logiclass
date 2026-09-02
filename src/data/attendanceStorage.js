import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const ATTENDANCE_COLLECTION = "attendance";


// =========================
// AMBIL SEMUA PRESENSI
// =========================

export const getAttendance = async () => {

  const snapshot = await getDocs(
    collection(db, ATTENDANCE_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
  }));

};


// =========================
// TAMBAH PRESENSI
// =========================
// ID presensi (ATT...) sudah dibuat di
// Attendance.jsx (pakai Date.now()), jadi
// di sini tinggal pakai setDoc dengan ID itu.

export const addAttendance = async (
  attendance
) => {

  const { id, ...attendanceData } = attendance;

  await setDoc(
    doc(db, ATTENDANCE_COLLECTION, id),
    attendanceData
  );

  return getAttendance();

};


// =========================
// HAPUS PRESENSI
// =========================

export const deleteAttendance = async (
  attendanceId
) => {

  await deleteDoc(
    doc(db, ATTENDANCE_COLLECTION, attendanceId)
  );

  return getAttendance();

};