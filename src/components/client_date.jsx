"use client";

export default function ClientDate({ value }) {
    if (!value) return "-";

    return (
        <span>
            {new Date(value).toLocaleDateString("tr-TR")}
        </span>
    );
}
