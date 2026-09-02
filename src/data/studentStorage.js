import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const STUDENTS_COLLECTION = "students";


// =========================
// AMBIL SEMUA DATA MURID
// =========================
// Sekarang berupa fungsi ASYNC
// (harus dipanggil dengan "await" atau ".then()")

export const getStudents = async () => {

  const snapshot = await getDocs(
    collection(db, STUDENTS_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
  }));

};


// =========================
// AMBIL SATU MURID BERDASARKAN ID
// =========================

export const getStudentById = async (
  studentId
) => {

  const students = await getStudents();

  return students.find(
    (student) => student.id === studentId
  );

};


// =========================
// TAMBAH MURID
// =========================
// ID murid (LG001, LG002, dst) tetap kita
// yang tentukan sendiri, supaya format ID
// lama tidak berubah. Makanya pakai setDoc
// dengan ID spesifik, bukan addDoc.

export const addStudent = async (student) => {

  const { id, ...studentData } = student;

  await setDoc(
    doc(db, STUDENTS_COLLECTION, id),
    studentData
  );

  return getStudents();

};


// =========================
// UPDATE MURID
// =========================

export const updateStudent = async (
  studentId,
  updatedData
) => {

  await updateDoc(
    doc(db, STUDENTS_COLLECTION, studentId),
    updatedData
  );

  return getStudents();

};


// =========================
// HAPUS MURID
// =========================

export const deleteStudent = async (
  studentId
) => {

  await deleteDoc(
    doc(db, STUDENTS_COLLECTION, studentId)
  );

  return getStudents();

};