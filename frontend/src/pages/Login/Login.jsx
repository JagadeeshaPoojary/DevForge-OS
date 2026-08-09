import { useState } from "react";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (response.data?.success && response.data?.token) {
        // Save JWT
        localStorage.setItem("token", response.data.token);

        // Save user information
        if (response.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        toast.success("Login successful!");

        navigate("/dashboard");
      } else {
        toast.error(
          response.data?.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b16] px-4">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl font-bold text-white shadow-xl shadow-violet-950/30">
            &lt;/&gt;
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to your DevForge OS workspace
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="text-sm text-slate-400">
                Email
              </label>

              <div className="relative mt-2">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    py-3
                    pl-11
                    pr-4
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-violet-500/50
                    focus:bg-white/[0.07]
                  "
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="text-sm text-slate-400">
                Password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    py-3
                    pl-11
                    pr-4
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-violet-500/50
                    focus:bg-white/[0.07]
                  "
                />

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
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

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}

            </button>

          </form>

        </div>

        {/* Test account */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Test account: devforge@test.com
        </p>

      </div>

    </div>
  );
}