import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Belum login
  if (!user) {
    return <Navigate to="/" replace />;
  }


  // Kalau allowedRole berupa array
  if (Array.isArray(allowedRole)) {

    if (!allowedRole.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

  }


  // Kalau allowedRole hanya satu role
  else {

    if (user.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

  }


  return children;
}

export default ProtectedRoute;