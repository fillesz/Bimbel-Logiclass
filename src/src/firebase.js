import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgiVqyt5-h3aHDSZzb4QN-Hc9Ag-Rha0A",
  authDomain: "logiclass-9ae8c.firebaseapp.com",
  projectId: "logiclass-9ae8c",
  storageBucket: "logiclass-9ae8c.firebasestorage.app",
  messagingSenderId: "988495382597",
  appId: "1:988495382597:web:6af3786e9a3f3fae90bb2c",
  measurementId: "G-7G11N532Z5",
};

const app = initializeApp(firebaseConfig);

// Firestore (database) — ini yang dipakai untuk
// menyimpan data murid, akun, laporan, dan paket
export const db = getFirestore(app);