import { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";
import { getAccounts } from "../data/accountStorage";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleLogin = async () => {

    // =========================
    // BERSIHKAN INPUT
    // =========================

    const inputUsername = username.trim();
    const inputPassword = password.trim();

    if (!inputUsername || !inputPassword) {

      alert(
        "Mohon isi username dan password."
      );

      return;

    }


    setIsLoading(true);


    try {

      // =========================
      // AMBIL AKUN DARI FIRESTORE
      // =========================

      const accounts = await getAccounts();


      // =========================
      // GABUNGKAN AKUN
      // =========================
      // users.js = akun bawaan/demo (statis)
      // accounts = akun yang dibuat lewat
      // halaman Pengaturan (Firestore)

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

    } catch (error) {

      console.error(
        "Gagal login:",
        error
      );

      alert(
        "Terjadi kesalahan saat login. Silakan coba lagi."
      );

    } finally {

      setIsLoading(false);

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
          disabled={isLoading}
        >
          {isLoading ? "Memeriksa..." : "Masuk"}
        </button>

      </div>

    </div>
  );
}

export default Login;