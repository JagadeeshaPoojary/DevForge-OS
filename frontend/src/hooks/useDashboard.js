import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const initialDashboard = {
  projects: 0,
  tasks: 0,
  notes: 0,
  events: 0,
};

export default function useDashboard() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/dashboard");

      const data = response?.data || {};

      setDashboard({
        projects: Number(data.projects ?? 0),
        tasks: Number(data.tasks ?? 0),
        notes: Number(data.notes ?? 0),
        events: Number(data.events ?? 0),
      });
    } catch (err) {
      console.error("Dashboard API Error:", err);

      console.error(
        "Status:",
        err?.response?.status
      );

      console.error(
        "Response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard."
      );

      // Keep dashboard usable even if API fails
      setDashboard(initialDashboard);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  // Initial API fetch is intentionally triggered from this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchDashboard();

    const handleDashboardRefresh = () => {
      fetchDashboard();
    };

    window.addEventListener(
      "devforge:dashboard-refresh",
      handleDashboardRefresh
    );

    return () => {
      window.removeEventListener(
        "devforge:dashboard-refresh",
        handleDashboardRefresh
      );
    };
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refreshDashboard: fetchDashboard,
  };
}