import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";

function Admin() {
  return (
    <DashboardLayout>

      <div className="welcome">

        <h1>Halo, Administrator 👋</h1>

        <p>
          Selamat datang di Dashboard LOGICLASS.
          Kelola seluruh aktivitas bimbel dari sini.
        </p>

      </div>

      <div className="cards">

        <StatCard
          icon="👨‍🎓"
          title="Murid Aktif"
          value="42"
        />

        <StatCard
          icon="👩‍🏫"
          title="Tutor"
          value="6"
        />

        <StatCard
          icon="📅"
          title="Hadir Hari Ini"
          value="38"
        />

        <StatCard
          icon="💰"
          title="Pembayaran"
          value="Rp8,2 jt"
        />

      </div>

    </DashboardLayout>
  );
}

export default Admin;