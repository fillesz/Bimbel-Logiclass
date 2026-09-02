import { db } from "../firebase";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const PAYMENTS_COLLECTION = "payments";


// =========================
// AMBIL SEMUA PEMBAYARAN
// =========================

export const getPayments = async () => {

  const snapshot = await getDocs(
    collection(db, PAYMENTS_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
  }));

};


// =========================
// TAMBAH PEMBAYARAN
// =========================
// Beda dari students/reports, di sini ID
// dibiarkan di-generate otomatis oleh Firestore
// (addDoc), karena Payment.jsx tidak mengirim
// ID manual seperti "PAY001" dst.

export const addPayment = async (payment) => {

  await addDoc(
    collection(db, PAYMENTS_COLLECTION),
    payment
  );

  return getPayments();

};


// =========================
// HAPUS PEMBAYARAN
// =========================

export const deletePayment = async (
  paymentId
) => {

  await deleteDoc(
    doc(db, PAYMENTS_COLLECTION, paymentId)
  );

  return getPayments();

};