import studentData from "./studentData";

const STUDENT_STORAGE_KEY = "students";


// =========================
// AMBIL DATA MURID
// =========================

export const getStudents = () => {
  const savedStudents =
    localStorage.getItem(
      STUDENT_STORAGE_KEY
    );

  if (savedStudents) {
    try {
      return JSON.parse(savedStudents);
    } catch (error) {
      console.error(
        "Data murid tidak valid:",
        error
      );
    }
  }

  // Jika belum ada data di localStorage,
  // gunakan data awal

  localStorage.setItem(
    STUDENT_STORAGE_KEY,
    JSON.stringify(studentData)
  );

  return studentData;
};


// =========================
// SIMPAN DATA MURID
// =========================

export const saveStudents = (
  students
) => {
  localStorage.setItem(
    STUDENT_STORAGE_KEY,
    JSON.stringify(students)
  );
};


// =========================
// TAMBAH MURID
// =========================

export const addStudent = (
  student
) => {

  const students =
    getStudents();

  const updatedStudents = [
    ...students,
    student,
  ];

  saveStudents(
    updatedStudents
  );

  return updatedStudents;
};


// =========================
// UPDATE MURID
// =========================

export const updateStudent = (
  studentId,
  updatedData
) => {

  const students =
    getStudents();

  const updatedStudents =
    students.map(
      (student) =>
        student.id === studentId
          ? {
              ...student,
              ...updatedData,
            }
          : student
    );

  saveStudents(
    updatedStudents
  );

  return updatedStudents;
};


// =========================
// HAPUS MURID
// =========================

export const deleteStudent = (
  studentId
) => {

  const students =
    getStudents();

  const updatedStudents =
    students.filter(
      (student) =>
        student.id !== studentId
    );

  saveStudents(
    updatedStudents
  );

  return updatedStudents;
};