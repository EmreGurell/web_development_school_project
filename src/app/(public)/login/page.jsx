"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Giriş başarısız. Email veya şifre hatalı olabilir.");
                return;
            }

            // Sadece patient rolü olanlar giriş yapabilir
            if (data.user.role !== "patient") {
                setError("Bu sisteme sadece hasta kullanıcıları giriş yapabilir");
                return;
            }

            localStorage.setItem("token", data.token);
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

            router.replace("/patient/dashboard");
        } catch (err) {
            setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* ----- BG EFFECTS ----- */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Giriş Yap
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                placeholder="ornek@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Parola</Label>
                            <Input

                                placeholder="********"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
