"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Breadcrumb mapping
const breadcrumbMap = {
    "/patient/dashboard": { label: "Dashboard", href: "/patient/dashboard" },
    "/patient/measurements": { label: "Ölçümlerim", href: "/patient/measurements" },
    "/patient/measurements/add": { label: "Ölçüm Ekle", href: "/patient/measurements/add" },
    "/patient/diagnosis": { label: "Tanılarım", href: "/patient/diagnosis" },
    "/patient/diagnosis/advices": { label: "Tavsiyeler", href: "/patient/diagnosis/advices" },
    "/patient/risk": { label: "Risk Raporu", href: "/patient/risk" },
};

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    
    // Breadcrumb items oluştur
    const getBreadcrumbs = () => {
        const items = [
            { label: "Dashboard", href: "/patient/dashboard" }
        ];

        // Eğer dashboard değilse, mevcut sayfanın breadcrumb'ını ekle
        if (pathname !== "/patient/dashboard") {
            const currentPage = breadcrumbMap[pathname];
            if (currentPage) {
                items.push(currentPage);
            } else {
                // Eğer mapping'de yoksa path'den oluştur
                const segments = pathname.split("/").filter(Boolean);
                if (segments.length > 2) {
                    const pageName = segments[segments.length - 1];
                    items.push({ 
                        label: pageName.charAt(0).toUpperCase() + pageName.slice(1),
                        href: pathname 
                    });
                }
            }
        }

        return items;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />

                <SidebarInset className="flex flex-col flex-1 min-h-screen">
                    {/* Header */}
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white dark:bg-gray-900">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />

                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={item.href}>
                                                    {item.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </div>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-4 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
