import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const ACCOUNTS_COLLECTION = "accounts";


// =========================
// AMBIL SEMUA AKUN
// =========================

export const getAccounts = async () => {

  const snapshot = await getDocs(
    collection(db, ACCOUNTS_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
  }));

};


// =========================
// TAMBAH AKUN
// =========================
// ID akun (ACC001, ACC002, dst) tetap kita
// yang tentukan sendiri, sama seperti
// studentStorage — pakai setDoc, bukan addDoc.

export const addAccount = async (account) => {

  const { id, ...accountData } = account;

  await setDoc(
    doc(db, ACCOUNTS_COLLECTION, id),
    accountData
  );

  return getAccounts();

};


// =========================
// UPDATE AKUN
// =========================

export const updateAccount = async (
  accountId,
  updatedData
) => {

  await updateDoc(
    doc(db, ACCOUNTS_COLLECTION, accountId),
    updatedData
  );

  return getAccounts();

};


// =========================
// HAPUS AKUN
// =========================

export const deleteAccount = async (
  accountId
) => {

  await deleteDoc(
    doc(db, ACCOUNTS_COLLECTION, accountId)
  );

  return getAccounts();

};