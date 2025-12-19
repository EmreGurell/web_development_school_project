import {toast} from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useLogout = () => {
    const logout = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}auth/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            localStorage.removeItem("token");
            document.cookie = "token=; path=/; max-age=0";


            if (!res.ok) {
                throw new Error(data.message || "Çıkış yapılamadı");
            }

            toast.success("Çıkış yapıldı");

            // auth state sıfırla
            window.location.href = "/";

        } catch (err) {
            toast.error(err.message);
        }
    };

    return {logout};
};