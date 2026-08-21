const defaultAttendance = [
  {
    id: "ATT001",
    studentId: "LG001",
    date: "10 Agustus 2026",
    subject: "Matematika",
    attendance: "Hadir",
  },
  {
    id: "ATT002",
    studentId: "LG003",
    date: "10 Agustus 2026",
    subject: "Bahasa Inggris",
    attendance: "Hadir",
  },
  {
    id: "ATT003",
    studentId: "LG001",
    date: "8 Agustus 2026",
    subject: "IPA",
    attendance: "Hadir",
  },
  {
    id: "ATT004",
    studentId: "LG003",
    date: "8 Agustus 2026",
    subject: "Matematika",
    attendance: "Izin",
  },
];


export const getAttendance = () => {
  const savedAttendance =
    localStorage.getItem("attendance");

  if (savedAttendance) {
    return JSON.parse(savedAttendance);
  }

  localStorage.setItem(
    "attendance",
    JSON.stringify(defaultAttendance)
  );

  return defaultAttendance;
};


export const addAttendance = (
  attendance
) => {

  const currentAttendance =
    getAttendance();

  const updatedAttendance = [
    ...currentAttendance,
    attendance,
  ];

  localStorage.setItem(
    "attendance",
    JSON.stringify(
      updatedAttendance
    )
  );

  return updatedAttendance;
};


export const updateAttendance = (
  id,
  updatedData
) => {

  const currentAttendance =
    getAttendance();

  const updatedAttendance =
    currentAttendance.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
            }
          : item
    );

  localStorage.setItem(
    "attendance",
    JSON.stringify(
      updatedAttendance
    )
  );

  return updatedAttendance;
};


export const deleteAttendance = (
  id
) => {

  const currentAttendance =
    getAttendance();

  const updatedAttendance =
    currentAttendance.filter(
      (item) =>
        item.id !== id
    );

  localStorage.setItem(
    "attendance",
    JSON.stringify(
      updatedAttendance
    )
  );

  return updatedAttendance;
};
