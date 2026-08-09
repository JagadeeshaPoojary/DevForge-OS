import { useEffect, useState } from "react";
import api from "../services/api";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState({
    projects: 0,
    tasks: 0,
    notes: 0,
    events: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { dashboard, loading };
}