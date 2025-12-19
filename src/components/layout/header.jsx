"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Menu, SidebarCloseIcon, User } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsAuth(false);
    router.push("/");
  };

  const links = [
    { label: "Panel", href: "/patient/dashboard" },
    { label: "Ulusal Analizler", href: "/analyses" },
    { label: "Bize Ulaşın", href: "/contact_us" },
  ];

  return (
    <header className="w-full py-4 px-6 z-50 lg:px-10 flex items-center justify-between fixed bg-white border-b">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" className="w-10 h-10" alt="logo" />
        <span className="font-space text-xl font-semibold text-gray-900">
          HEALTHCARE
        </span>
      </div>

      {/* Desktop Menü */}
      <nav className="hidden lg:flex items-center gap-10">
        {links.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="text-gray-700 hover:text-[#56B3FF] transition"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Desktop Sağ Alan */}
      <div className="hidden lg:flex items-center gap-4">
        {!isAuth ? (
          <Button variant="primary" onClick={() => router.push("/login")}>
            Giriş Yap
          </Button>
        ) : (
          <>
            <Button
              variant="text"
              className="flex gap-2"
              onClick={() => router.push("/patient/dashboard")}
            >
              <User size={18} />
              Hesabım
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <Button
        variant="text"
        className="lg:hidden text-gray-900 text-3xl"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 
                transform transition-transform duration-300 
                ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <span className="font-semibold">Menü</span>
          <Button variant="text" onClick={() => setOpen(false)}>
            <SidebarCloseIcon />
          </Button>
        </div>

        <nav className="flex flex-col p-6 gap-6">
          {links.map((item, i) => (
            <a key={i} href={item.href} className="text-gray-700 text-lg">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4 px-6 mt-4">
          {!isAuth ? (
            <Button variant="primary" onClick={() => router.push("/login")}>
              Giriş Yap
            </Button>
          ) : (
            <>
              <Button onClick={() => router.push("/patient/dashboard")}>
                Hesabım
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
