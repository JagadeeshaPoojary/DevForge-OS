import { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { user, loading } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const fullName = user?.full_name || "User";
  const email = user?.email || "";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="relative">

      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-3
          rounded-2xl
          border border-white/10
          bg-white/[0.04]
          px-3 py-2
          transition-all duration-200
          hover:bg-white/[0.08]
        "
      >

        {/* Avatar */}
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            bg-gradient-to-br
            from-violet-500
            to-blue-500
            text-sm
            font-bold
            text-white
          "
        >
          {loading ? "..." : initial}
        </div>

        {/* User Information */}
        <div className="hidden text-left sm:block">

          <p className="max-w-[140px] truncate text-sm font-medium text-white">
            {loading ? "Loading..." : fullName}
          </p>

          <p className="max-w-[140px] truncate text-[11px] text-slate-500">
            {email || "Developer"}
          </p>

        </div>

        <ChevronDown
          size={15}
          className={`text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 top-14 z-50
            w-72
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-[#0b1020]/95
            shadow-2xl
            shadow-black/40
            backdrop-blur-2xl
          "
        >

          {/* Profile Header */}
          <div className="border-b border-white/10 p-5">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  text-lg
                  font-bold
                  text-white
                "
              >
                {initial}
              </div>

              <div className="min-w-0">

                <p className="truncate font-semibold text-white">
                  {fullName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {email}
                </p>

              </div>

            </div>

          </div>

          {/* Menu */}
          <div className="p-2">

            {/* Profile */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm text-slate-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <User size={17} />
              Profile
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm text-slate-300
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <Settings size={17} />
              Settings
            </button>

            <div className="my-2 border-t border-white/5" />

            {/* Security */}
            <div
              className="
                flex items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm text-slate-500
              "
            >
              <ShieldCheck
                size={17}
                className="text-emerald-400"
              />

              <span>Account secured</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm text-red-400
                transition
                hover:bg-red-500/10
              "
            >
              <LogOut size={17} />
              Sign out
            </button>

          </div>

        </div>
      )}

    </div>
  );
}