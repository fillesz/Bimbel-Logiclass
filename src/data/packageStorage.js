import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const PACKAGES_COLLECTION = "packages";


// =========================
// AMBIL SEMUA PAKET
// =========================
// Dipakai kalau butuh data paket
// banyak murid sekaligus (misalnya
// buat dropdown di form laporan)

export const getPackages = async () => {

  const snapshot = await getDocs(
    collection(db, PACKAGES_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    studentId: docSnap.id,
  }));

};


// =========================
// AMBIL PAKET SATU MURID
// =========================

export const getPackageByStudent = async (
  studentId
) => {

  const docSnap = await getDoc(
    doc(db, PACKAGES_COLLECTION, studentId)
  );

  if (!docSnap.exists()) {

    return null;

  }

  return {
    ...docSnap.data(),
    studentId: docSnap.id,
  };

};


// =========================
// HITUNG SISA PERTEMUAN
// =========================
// Fungsi murni, tidak perlu Firestore,
// jadi tetap sinkron seperti sebelumnya

export const getRemainingMeetings = (
  packageItem
) => {

  if (!packageItem) {

    return 0;

  }

  return Math.max(
    packageItem.totalMeetings -
      packageItem.usedMeetings,
    0
  );

};


// =========================
// STATUS PAKET
// =========================
// Fungsi murni juga, tetap sinkron

export const getPackageStatus = (
  packageItem
) => {

  const remaining =
    getRemainingMeetings(packageItem);

  if (remaining === 0) {

    return {
      status: "expired",
      label: "Paket Habis",
      className: "package-danger",
      color: "red",
      canTeach: false,
    };

  }

  if (remaining === 1) {

    return {
      status: "warning",
      label: "Hampir Habis",
      className: "package-warning",
      color: "yellow",
      canTeach: true,
    };

  }

  return {
    status: "active",
    label: "Paket Aktif",
    className: "package-active",
    color: "green",
    canTeach: true,
  };

};


// =========================
// AKTIFKAN / RESET PAKET
// =========================
// Dipanggil saat pembayaran baru dicatat.
// Membuat paket baru untuk murid tersebut,
// atau menimpa paket lama kalau sudah ada
// (usedMeetings selalu direset ke 0).

export const activatePackage = async (
  studentId,
  { packageName, totalMeetings, startDate }
) => {

  await setDoc(
    doc(db, PACKAGES_COLLECTION, studentId),
    {
      packageName,
      totalMeetings,
      usedMeetings: 0,
      startDate,
    }
  );

  return getPackageByStudent(studentId);

};


// =========================
// TAMBAH 1 PERTEMUAN
// =========================

export const useOneMeeting = async (
  studentId
) => {

  const currentPackage =
    await getPackageByStudent(studentId);

  if (!currentPackage) {

    return {
      success: false,
      message:
        "Paket murid tidak ditemukan.",
    };

  }

  const remaining =
    getRemainingMeetings(
      currentPackage
    );

  // Paket sudah habis
  if (remaining <= 0) {

    return {
      success: false,
      message:
        "Paket murid sudah habis. Tutor tidak dapat mengajar.",
    };

  }

  const newUsedMeetings =
    currentPackage.usedMeetings + 1;

  await updateDoc(
    doc(db, PACKAGES_COLLECTION, studentId),
    {
      usedMeetings: newUsedMeetings,
    }
  );

  const updatedPackage = {
    ...currentPackage,
    usedMeetings: newUsedMeetings,
  };

  return {
    success: true,
    message:
      "Pertemuan berhasil digunakan.",
    package: updatedPackage,
    remaining:
      getRemainingMeetings(
        updatedPackage
      ),
  };

};