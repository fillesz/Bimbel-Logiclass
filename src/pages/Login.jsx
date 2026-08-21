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
    // AMBIL AKUN DARI LOCALSTORAGE
    // =========================

    const savedAccounts =
      localStorage.getItem("accounts");

    const accounts = savedAccounts
      ? JSON.parse(savedAccounts)
      : [];

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
        u.username === username &&
        u.password === password
    );

    // =========================
    // LOGIN GAGAL
    // =========================

    if (!user) {
      alert("Username atau Password salah!");
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
    // REDIRECT BERDASARKAN ROLE
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
        alert("Role tidak dikenali");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>📚 Dashboard</h1>

        <h2>LOGICLASS</h2>

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

        <button onClick={handleLogin}>
          Masuk
        </button>

      </div>

    </div>
  );
}

export default Login;