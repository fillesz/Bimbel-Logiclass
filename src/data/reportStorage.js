import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const REPORTS_COLLECTION = "reports";


// =========================
// AMBIL SEMUA LAPORAN
// =========================

export const getReports = async () => {

  const snapshot = await getDocs(
    collection(db, REPORTS_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
  }));

};


// =========================
// TAMBAH LAPORAN
// =========================
// ID laporan (R001, R002, dst) tetap kita
// yang tentukan sendiri, sama seperti
// studentStorage — pakai setDoc, bukan addDoc.

export const addReport = async (report) => {

  const { id, ...reportData } = report;

  await setDoc(
    doc(db, REPORTS_COLLECTION, id),
    reportData
  );

  return getReports();

};


// =========================
// HAPUS LAPORAN
// =========================

export const deleteReport = async (
  reportId
) => {

  await deleteDoc(
    doc(db, REPORTS_COLLECTION, reportId)
  );

  return getReports();

};