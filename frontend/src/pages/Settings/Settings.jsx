import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        if (response.data?.success) {
          const profile = response.data.user;

          setUser(profile);
          setFullName(profile.full_name || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      toast.error("Full name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/profile", {
        full_name: trimmedName,
      });

      if (response.data?.success) {
        setUser(response.data.user);
        setFullName(response.data.user.full_name);

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-violet-400">
          DevForge OS
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your workspace preferences.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Profile */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2">
              <User className="text-violet-400" size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Profile
              </h2>

              <p className="text-xs text-slate-500">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-sm text-slate-400">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-violet-500/50
                  focus:bg-white/[0.07]
                "
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-slate-400">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="
                  mt-2
                  w-full
                  cursor-not-allowed
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  px-4
                  py-3
                  text-slate-500
                  outline-none
                "
              />

              <p className="mt-2 text-xs text-slate-600">
                Email cannot be changed from Settings.
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-slate-400">
                Role
              </label>

              <input
                value="Developer"
                readOnly
                className="
                  mt-2
                  w-full
                  cursor-not-allowed
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  px-4
                  py-3
                  text-slate-500
                  outline-none
                "
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                px-4
                py-3
                font-medium
                text-white
                shadow-lg
                shadow-violet-950/20
                transition
                hover:from-violet-500
                hover:to-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>

          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2">
              <Bell className="text-blue-400" size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Notifications
              </h2>

              <p className="text-xs text-slate-500">
                Control workspace notifications
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="font-medium text-white">
                Workspace notifications
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Receive updates about your tasks and events.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`
                relative
                h-6
                w-11
                shrink-0
                rounded-full
                transition
                ${
                  notifications
                    ? "bg-violet-600"
                    : "bg-white/10"
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-1
                  h-4
                  w-4
                  rounded-full
                  bg-white
                  transition
                  ${
                    notifications
                      ? "left-6"
                      : "left-1"
                  }
                `}
              />
            </button>

          </div>

        </div>

        {/* Appearance */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-2">
              <Palette className="text-pink-400" size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Appearance
              </h2>

              <p className="text-xs text-slate-500">
                Customize your workspace
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-medium text-white">
              Premium Dark Glass
            </p>

            <p className="mt-1 text-sm text-slate-500">
              DevForge OS currently uses the premium
              glassmorphism interface.
            </p>
          </div>

        </div>

        {/* Security */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2">
              <Shield className="text-emerald-400" size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Security
              </h2>

              <p className="text-xs text-slate-500">
                Account protection
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              <div>
                <p className="font-medium text-emerald-400">
                  JWT Authentication Active
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your account is protected by secure
                  token-based authentication.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}