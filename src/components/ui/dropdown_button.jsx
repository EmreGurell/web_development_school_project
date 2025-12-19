"use client";

import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// options: [{ label: "Sil", onClick: () => {}, className: "" }]
export default function DropdownButton({
                                      options = [],
                                      iconSize = 16,
                                      iconColor = "text-gray-600",
                                      align = "start",
                                      className = "",
                                      menuClassName = "w-20",
                                  }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`p-2 rounded-lg hover:bg-gray-100 transition ${className}`}>
                    <MoreVertical size={iconSize} className={iconColor} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align} className={menuClassName}>
                {options.map((opt, i) => (
                    <DropdownMenuItem
                        key={i}
                        onClick={opt.onClick}
                        className={`cursor-pointer ${opt.className || ""}`}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
