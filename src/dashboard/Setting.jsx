import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

function Setting() {
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // DATA AKUN
  // =========================

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem("accounts");

    if (savedAccounts) {
      return JSON.parse(savedAccounts);
    }

    return [
      {
        id: "ACC001",
        username: "bara",
        name: "Kak Bara",
        role: "tutor",
        tutorId: "T001",
      },
      {
        id: "ACC002",
        username: "rani",
        name: "Kak Rani",
        role: "tutor",
        tutorId: "T002",
      },
      {
        id: "ACC003",
        username: "ortuaisyah",
        name: "Orang Tua Aisyah",
        role: "parent",
        studentId: "LG001",
      },
      {
        id: "ACC004",
        username: "ortufajar",
        name: "Orang Tua Fajar",
        role: "parent",
        studentId: "LG002",
      },
    ];
  });

  // =========================
  // FORM TAMBAH / EDIT
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [editingAccount, setEditingAccount] = useState(null);

  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    name: "",
    role: "tutor",
    tutorId: "",
    studentId: "",
  });

  // =========================
  // BUKA FORM TAMBAH
  // =========================

  const handleOpenAdd = () => {
    setEditingAccount(null);

    setNewAccount({
      username: "",
      password: "",
      name: "",
      role: "tutor",
      tutorId: "",
      studentId: "",
    });

    setShowForm(true);
  };

  // =========================
  // BUKA FORM EDIT
  // =========================

  const handleOpenEdit = (account) => {
    setEditingAccount(account);

    setNewAccount({
      username: account.username || "",
      password: account.password || "",
      name: account.name || "",
      role: account.role || "tutor",
      tutorId: account.tutorId || "",
      studentId: account.studentId || "",
    });

    setShowForm(true);
  };

  // =========================
  // TUTUP FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(null);

    setNewAccount({
      username: "",
      password: "",
      name: "",
      role: "tutor",
      tutorId: "",
      studentId: "",
    });
  };

  // =========================
  // GENERATE ID AKUN
  // =========================

  const generateAccountId = () => {
    if (accounts.length === 0) {
      return "ACC001";
    }

    const numbers = accounts
      .map((account) => {
        const number = parseInt(
          account.id.replace("ACC", ""),
          10
        );

        return isNaN(number) ? 0 : number;
      });

    const highestNumber = Math.max(...numbers);

    return `ACC${String(highestNumber + 1).padStart(3, "0")}`;
  };

  // =========================
  // SIMPAN AKUN
  // TAMBAH / EDIT
  // =========================

  const handleSaveAccount = (e) => {
    e.preventDefault();

    // Validasi dasar
    if (
      !newAccount.username.trim() ||
      !newAccount.name.trim()
    ) {
      alert("Nama dan username wajib diisi.");
      return;
    }

    // Password wajib saat tambah
    if (
      !editingAccount &&
      !newAccount.password.trim()
    ) {
      alert("Password wajib diisi.");
      return;
    }

    // Validasi ID sesuai role
    if (
      newAccount.role === "tutor" &&
      !newAccount.tutorId.trim()
    ) {
      alert("Tutor ID wajib diisi.");
      return;
    }

    if (
      newAccount.role === "parent" &&
      !newAccount.studentId.trim()
    ) {
      alert("Student ID wajib diisi.");
      return;
    }

    // =========================
    // CEK USERNAME DUPLIKAT
    // =========================

    const duplicateUsername = accounts.some(
      (account) =>
        account.username.toLowerCase() ===
          newAccount.username
            .trim()
            .toLowerCase() &&
        account.id !== editingAccount?.id
    );

    if (duplicateUsername) {
      alert(
        "Username tersebut sudah digunakan. Silakan gunakan username lain."
      );
      return;
    }

    // =========================
    // MODE EDIT
    // =========================

    if (editingAccount) {
      const updatedAccounts = accounts.map(
        (account) => {
          if (account.id !== editingAccount.id) {
            return account;
          }

          return {
            ...account,

            username:
              newAccount.username.trim(),

            name:
              newAccount.name.trim(),

            role:
              newAccount.role,

            // Password hanya diubah
            // kalau field diisi
            ...(newAccount.password.trim()
              ? {
                  password:
                    newAccount.password.trim(),
                }
              : {}),

            // Tutor
            ...(newAccount.role === "tutor"
              ? {
                  tutorId:
                    newAccount.tutorId.trim(),
                  studentId: undefined,
                }
              : {}),

            // Parent
            ...(newAccount.role === "parent"
              ? {
                  studentId:
                    newAccount.studentId.trim(),
                  tutorId: undefined,
                }
              : {}),
          };
        }
      );

      setAccounts(updatedAccounts);

      localStorage.setItem(
        "accounts",
        JSON.stringify(updatedAccounts)
      );

      alert("Akun berhasil diperbarui.");

      handleCloseForm();

      return;
    }

    // =========================
    // MODE TAMBAH
    // =========================

    const newAccountData = {
      id: generateAccountId(),

      username:
        newAccount.username.trim(),

      password:
        newAccount.password.trim(),

      name:
        newAccount.name.trim(),

      role:
        newAccount.role,

      ...(newAccount.role === "tutor"
        ? {
            tutorId:
              newAccount.tutorId.trim(),
          }
        : {
            studentId:
              newAccount.studentId.trim(),
          }),
    };

    const updatedAccounts = [
      ...accounts,
      newAccountData,
    ];

    setAccounts(updatedAccounts);

    localStorage.setItem(
      "accounts",
      JSON.stringify(updatedAccounts)
    );

    alert("Akun berhasil ditambahkan.");

    handleCloseForm();
  };

  // =========================
  // HAPUS AKUN
  // =========================

  const handleDeleteAccount = (account) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus akun "${account.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedAccounts = accounts.filter(
      (item) => item.id !== account.id
    );

    setAccounts(updatedAccounts);

    localStorage.setItem(
      "accounts",
      JSON.stringify(updatedAccounts)
    );

    alert("Akun berhasil dihapus.");
  };

  // =========================
  // ROLE LABEL
  // =========================

  const getRoleLabel = (role) => {
    if (role === "admin") {
      return "👑 Admin";
    }

    if (role === "tutor") {
      return "👩‍🏫 Tutor";
    }

    if (role === "parent") {
      return "👨‍👩‍👧 Parent";
    }

    return role;
  };

  // =========================
  // ROLE CLASS
  // =========================

  const getRoleClass = (role) => {
    if (role === "admin") {
      return "account-role admin";
    }

    if (role === "tutor") {
      return "account-role tutor";
    }

    return "account-role parent";
  };

  // =========================
  // AVATAR
  // =========================

  const getAvatar = (role) => {
    if (role === "admin") {
      return "👑";
    }

    if (role === "tutor") {
      return "👩‍🏫";
    }

    return "👨‍👩‍👧";
  };

  // =========================
  // BUKAN ADMIN
  // =========================

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="setting-page">

          <div className="page-header">
            <div>
              <h1>⚙️ Pengaturan</h1>

              <p>
                Pengaturan akun LOGICLASS.
              </p>
            </div>
          </div>

          <div className="setting-empty">
            🔒 Pengaturan akun hanya dapat
            diakses oleh Admin.
          </div>

        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // ADMIN VIEW
  // =========================

  return (
    <DashboardLayout>

      <div className="setting-page">

        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>
            <h1>⚙️ Pengaturan</h1>

            <p>
              Kelola akun pengguna LOGICLASS.
            </p>
          </div>

          <button
            className="add-button"
            onClick={handleOpenAdd}
          >
            + Tambah Akun
          </button>

        </div>


        {/* =========================
            ACCOUNT TABLE
        ========================= */}

        <div className="account-table-card">

          <div className="table-title">

            <div>
              <h2>
                👥 Manajemen Akun
              </h2>

              <p>
                Daftar akun pengguna LOGICLASS.
              </p>
            </div>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Pengguna
                  </th>

                  <th>
                    Username
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    ID Terkait
                  </th>

                  <th>
                    Aksi
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* =========================
                    ADMIN
                ========================= */}

                <tr>

                  <td>

                    <div className="account-user">

                      <div className="account-avatar admin-avatar">
                        👑
                      </div>

                      <div>

                        <strong>
                          Administrator
                        </strong>

                        <small>
                          ACC-ADMIN
                        </small>

                      </div>

                    </div>

                  </td>


                  <td>

                    <span className="username-text">
                      {user.username}
                    </span>

                  </td>


                  <td>

                    <span className="account-role admin">
                      👑 Admin
                    </span>

                  </td>


                  <td>

                    <span className="account-id">
                      -
                    </span>

                  </td>


                  <td>

                    <span className="protected-text">
                      🔒 Utama
                    </span>

                  </td>

                </tr>


                {/* =========================
                    AKUN LAIN
                ========================= */}

                {accounts.length > 0 ? (

                  accounts.map((account) => (

                    <tr key={account.id}>

                      <td>

                        <div className="account-user">

                          <div
                            className={`account-avatar ${account.role}-avatar`}
                          >
                            {getAvatar(account.role)}
                          </div>

                          <div>

                            <strong>
                              {account.name}
                            </strong>

                            <small>
                              {account.id}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="username-text">
                          {account.username}
                        </span>

                      </td>


                      <td>

                        <span
                          className={getRoleClass(
                            account.role
                          )}
                        >
                          {getRoleLabel(
                            account.role
                          )}
                        </span>

                      </td>


                      <td>

                        <span className="account-id">

                          {account.role === "tutor"
                            ? account.tutorId
                            : account.studentId}

                        </span>

                      </td>


                      <td>

                        <div className="account-actions">

                          {/* EDIT */}

                          <button
                            className="edit-button"
                            title="Edit akun"
                            onClick={() =>
                              handleOpenEdit(account)
                            }
                          >
                            ✏️
                          </button>


                          {/* DELETE */}

                          <button
                            className="delete-button"
                            title="Hapus akun"
                            onClick={() =>
                              handleDeleteAccount(
                                account
                              )
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-data"
                    >
                      Belum ada akun Tutor atau Parent.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =========================
          MODAL TAMBAH / EDIT
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>

                <h2>

                  {editingAccount
                    ? "✏️ Edit Akun"
                    : "👤 Tambah Akun"}

                </h2>

                <p>

                  {editingAccount
                    ? "Perbarui informasi akun pengguna."
                    : "Buat akun Tutor atau Parent."}

                </p>

              </div>


              <button
                className="close-button"
                onClick={handleCloseForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSaveAccount}>

              {/* NAMA */}

              <label>
                Nama
              </label>

              <input
                type="text"
                placeholder="Contoh: Kak Bara"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    name: e.target.value,
                  })
                }
              />


              {/* USERNAME */}

              <label>
                Username
              </label>

              <input
                type="text"
                placeholder="Contoh: bara"
                value={newAccount.username}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    username:
                      e.target.value,
                  })
                }
              />


              {/* PASSWORD */}

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder={
                  editingAccount
                    ? "Kosongkan jika tidak diubah"
                    : "Masukkan password"
                }
                value={newAccount.password}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    password:
                      e.target.value,
                  })
                }
              />


              {/* ROLE */}

              <label>
                Role
              </label>

              <select
                value={newAccount.role}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    role: e.target.value,
                  })
                }
              >

                <option value="tutor">
                  👩‍🏫 Tutor
                </option>

                <option value="parent">
                  👨‍👩‍👧 Parent
                </option>

              </select>


              {/* TUTOR ID */}

              {newAccount.role === "tutor" && (

                <>
                  <label>
                    Tutor ID
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: T003"
                    value={
                      newAccount.tutorId
                    }
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        tutorId:
                          e.target.value,
                      })
                    }
                  />
                </>

              )}


              {/* STUDENT ID */}

              {newAccount.role === "parent" && (

                <>
                  <label>
                    Student ID
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: LG001"
                    value={
                      newAccount.studentId
                    }
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        studentId:
                          e.target.value,
                      })
                    }
                  />
                </>

              )}


              {/* BUTTON */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseForm}
                >
                  Batal
                </button>


                <button
                  type="submit"
                  className="save-button"
                >

                  {editingAccount
                    ? "Simpan Perubahan"
                    : "Simpan Akun"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Setting;