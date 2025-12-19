"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SecurityPage() {
    const [oldPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor");
            return;
        }

        if (newPassword.length < 6) {
            toast.warning("Yeni şifre en az 6 karakter olmalıdır");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Şifre değiştirilemedi");
            }

            toast.success("Şifreniz başarıyla güncellendi");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-xl space-y-6">
            <h2 className="text-2xl font-semibold">Şifre ve Güvenlik</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Şifre Değiştir</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Mevcut Şifre</Label>
                            <Input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Yeni Şifre</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Yeni Şifre (Tekrar)</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
