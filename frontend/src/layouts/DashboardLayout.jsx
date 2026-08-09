import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:ml-72">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}