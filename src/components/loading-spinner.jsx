"use client";

export function LoadingSpinner({ message = "Yükleniyor..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

