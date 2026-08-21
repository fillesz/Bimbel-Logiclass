import packageData from "./packageData";

// =========================
// STORAGE KEY
// =========================

const PACKAGE_STORAGE_KEY = "packages";

// =========================
// GET PACKAGES
// =========================

export const getPackages = () => {
  const savedPackages =
    localStorage.getItem(PACKAGE_STORAGE_KEY);

  if (savedPackages) {
    try {
      return JSON.parse(savedPackages);
    } catch (error) {
      console.error(
        "Data paket di localStorage rusak:",
        error
      );
    }
  }

  localStorage.setItem(
    PACKAGE_STORAGE_KEY,
    JSON.stringify(packageData)
  );

  return packageData;
};

// =========================
// SAVE PACKAGES
// =========================

export const savePackages = (packages) => {
  localStorage.setItem(
    PACKAGE_STORAGE_KEY,
    JSON.stringify(packages)
  );
};

// =========================
// GET PACKAGE BY STUDENT
// =========================

export const getPackageByStudent = (
  studentId
) => {
  const packages = getPackages();

  return packages.find(
    (pkg) =>
      pkg.studentId === studentId
  );
};

// =========================
// HITUNG SISA PERTEMUAN
// =========================

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
// TAMBAH 1 PERTEMUAN
// =========================

export const useOneMeeting = (
  studentId
) => {
  const packages = getPackages();

  const packageIndex =
    packages.findIndex(
      (pkg) =>
        pkg.studentId === studentId
    );

  if (packageIndex === -1) {
    return {
      success: false,
      message:
        "Paket murid tidak ditemukan.",
    };
  }

  const currentPackage =
    packages[packageIndex];

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

  const updatedPackage = {
    ...currentPackage,
    usedMeetings:
      currentPackage.usedMeetings + 1,
  };

  const updatedPackages = [
    ...packages,
  ];

  updatedPackages[packageIndex] =
    updatedPackage;

  savePackages(updatedPackages);

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