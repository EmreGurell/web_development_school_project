import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function usePatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const tokenUser = getUserFromToken();
        
        if (!tokenUser) {
          setLoading(false);
          return;
        }

        // Token'dan gelen temel bilgiler
        let userProfile = {
          name: tokenUser.name || tokenUser.email?.split("@")[0] || "Kullanıcı",
          email: tokenUser.email || "",
          avatar: tokenUser.avatar || undefined,
        };

        // API'den profil bilgilerini çek
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}patient/me`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.profile) {
              // Profil bilgisi varsa kullan
              const profile = data.data.profile;
              userProfile.name = `${profile.name || ""} ${profile.surname || ""}`.trim() || userProfile.name;
              userProfile.email = data.data.user?.email || userProfile.email;
            }
          }
        } catch (apiError) {
          // API hatası olursa token'dan gelen bilgileri kullan
          console.warn("Profil API hatası:", apiError);
        }

        setUser(userProfile);
      } catch (error) {
        console.error("User profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  return { user, loading };
}
