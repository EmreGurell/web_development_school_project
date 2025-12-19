"use client";

import * as React from "react";
import { Ruler, ScanHeart, Settings2, TriangleAlert } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePatientProfile } from "@/hooks/use-patient-profile";

const navMainData = [
  {
    title: "Ölçümlerim",
    url: "#",
    icon: Ruler,
    isActive: true,
    items: [
      { title: "Tüm Ölçümlerim", url: "/patient/measurements/" },
      { title: "Ölçüm Ekle", url: "/patient/measurements/add" },
    ],
  },
  {
    title: "Tanılarım",
    url: "#",
    icon: ScanHeart,
    items: [
      { title: "Tüm Tanılarım", url: "/patient/diagnosis/" },
      { title: "Tavsiyeler", url: "/patient/diagnosis/advices" },
    ],
  },
  {
    title: "Risk Raporu",
    url: "#",
    icon: TriangleAlert,
    items: [{ title: "Risk Raporum", url: "/patient/risk/" }],
  },
  {
    title: "Ayarlar",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Şifre ve Güvenlik", url: "/patient/settings/security" },
      { title: "Tercihler", url: "#" },
    ],
  },
];

export function AppSidebar(props) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed" || state === "icon";
  const router = useRouter();
  const { user, loading } = usePatientProfile();

  // Kullanıcı adının baş harflerini al (avatar fallback için)
  const getInitials = (name) => {
    if (!name) return "KU";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {!isCollapsed && (
        <SidebarHeader>
          <div
            className="flex items-center space-x-2"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.png" alt="logo" width={45} height={45} />
            <p className="text-lg font-semibold">HEALTHCARE</p>
          </div>
        </SidebarHeader>
      )}

      {isCollapsed && (
        <div className="flex items-center justify-center py-4">
          <Image src="/logo.png" alt="logo" width={35} height={35} />
        </div>
      )}

      <SidebarContent>
        <NavMain items={navMainData} />
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Yükleniyor...</div>
        ) : user ? (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              initials: getInitials(user.name),
            }}
          />
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
