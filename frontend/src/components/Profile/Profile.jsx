import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(false);

        const response = await api.get("/profile");

        if (response.data?.success) {
          setUser(response.data.user);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-violet-400"
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-8 text-center">
          <p className="font-medium text-red-400">
            Unable to load profile
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please login again and try again.
          </p>
        </div>
      </div>
    );
  }

  const fullName = user.full_name || "User";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-violet-400">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Your Profile
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your DevForge OS account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-violet-600/30 via-blue-500/20 to-cyan-500/20" />

        {/* User */}
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-[#080c18] bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-bold text-white shadow-xl">
              {initial}
            </div>

            <div className="pb-1">
              <h2 className="text-2xl font-bold text-white">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                DevForge OS User
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Information */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Personal Information */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2">
              <User
                size={19}
                className="text-violet-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-white">
              Personal Information
            </h2>
          </div>

          <div className="space-y-5">

            {/* Name */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-600">
                Full Name
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <User
                  size={17}
                  className="text-slate-500"
                />

                <span className="text-sm text-slate-300">
                  {user.full_name}
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-600">
                Email
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <Mail
                  size={17}
                  className="text-slate-500"
                />

                <span className="truncate text-sm text-slate-300">
                  {user.email}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2">
              <ShieldCheck
                size={19}
                className="text-emerald-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-white">
              Account Information
            </h2>
          </div>

          <div className="space-y-5">

            {/* Status */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-600">
                Account Status
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                <span className="text-sm text-emerald-400">
                  Active
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-600">
                Member Since
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <CalendarDays
                  size={17}
                  className="text-slate-500"
                />

                <span className="text-sm text-slate-300">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Not available"}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}