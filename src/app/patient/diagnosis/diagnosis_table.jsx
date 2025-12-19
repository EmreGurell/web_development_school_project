"use client";

import { useEffect, useState } from "react";
import { GenericDataTable } from "@/components/data-table/generic_data_table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import ClientDate from "@/components/client_date";

export default function DiagnosisTable() {
  const [diagnosis, setDiagnosis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchDiagnosis() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}diagnosis/my`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          document.cookie = "token=; Max-Age=0; path=/";
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        if (!data || !data.success)
          throw new Error(data?.message || "Veri alınamadı");

        setDiagnosis(data.data || []);
      } catch (err) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchDiagnosis();
  }, [token]);

  const columns = [
    {
      accessorKey: "diseases",
      header: "Tanılar",
      cell: ({ row }) => {
        const diseases = row.original.diseases;
        return Array.isArray(diseases) ? diseases.join(", ") : diseases || "—";
      },
    },
    {
      accessorKey: "doctorId",
      header: "Doktor",
      cell: ({ row }) => {
        const doctor = row.original.doctorId;
        return doctor?.fullName || "—";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tarih",
      cell: ({ row }) => {
        const value = row.getValue("createdAt");
        return <ClientDate value={value} />;
      },
    },
  ];

  if (loading) return <LoadingSpinner message="Tanılar yükleniyor..." />;
  if (error)
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );

  if (loading) return <SkeletonTable entityName="Tanı" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <GenericDataTable
      data={diagnosis || []}
      columns={columns}
      config={{
        entityName: "Tanı",
        entityNamePlural: "Tanılar",
        searchField: "diseases",
        searchPlaceholder: "Tanı adına göre filtrele...",
      }}
      actions={{
        onCreate: { enabled: false },
        onEdit: { enabled: false },
        onDelete: { enabled: false },
      }}
    />
  );
}
