import { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // =========================
    // BERSIHKAN INPUT
    // =========================

    const inputUsername = username.trim();
    const inputPassword = password.trim();

    // =========================
    // AMBIL AKUN TAMBAHAN
    // =========================

    let accounts = [];

    const savedAccounts =
      localStorage.getItem("accounts");

    if (savedAccounts) {
      try {
        accounts = JSON.parse(savedAccounts);

        if (!Array.isArray(accounts)) {
          accounts = [];
        }
      } catch (error) {
        console.error(
          "Data accounts rusak:",
          error
        );

        accounts = [];
      }
    }

    // =========================
    // GABUNGKAN AKUN
    // =========================

    const allUsers = [
      ...users,
      ...accounts,
    ];

    // =========================
    // CARI USER
    // =========================

    const user = allUsers.find(
      (u) =>
        u.username === inputUsername &&
        u.password === inputPassword
    );

    // =========================
    // LOGIN GAGAL
    // =========================

    if (!user) {
      alert(
        "Username atau Password salah!"
      );
      return;
    }

    // =========================
    // SIMPAN USER LOGIN
    // =========================

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // =========================
    // REDIRECT
    // =========================

    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;

      case "tutor":
        navigate("/tutor");
        break;

      case "parent":
        navigate("/parent");
        break;

      default:
        alert("Role tidak dikenali.");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>
          📚 Dashboard
        </h1>

        <h2>
          LOGICLASS
        </h2>

        <p>
          Silakan login terlebih dahulu
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
        >
          Masuk
        </button>

      </div>

    </div>
  );
}

export default Login;