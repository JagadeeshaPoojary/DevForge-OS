import { useEffect, useState } from "react";
import api from "../services/api";

export default function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    user,
    loading,
  };
}