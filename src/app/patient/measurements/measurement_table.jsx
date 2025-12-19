"use client";

import { GenericDataTable } from "@/components/data-table/generic_data_table";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import ClientDate from "@/components/client_date";
import { toast } from "sonner";

export default function MeasurementsTable() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}measurements/my`,
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

      if (!data.success) {
        throw new Error(data.message || "Veri alınamadı");
      }

      setMeasurements(data.data || []);
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMeasurements();
  }, [token]);

  const handleDelete = async (measurement) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}measurements/delete/${measurement._id}`,
        {
          method: "DELETE",
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

      if (!data.success) {
        throw new Error(data.message || "Ölçüm silinemedi");
      }

      toast.success("Ölçüm başarıyla silindi");
      fetchMeasurements(); // Verileri yeniden yükle
    } catch (err) {
      toast.error(err.message || "Ölçüm silinirken bir hata oluştu");
    }
  };

  const columns = [
    {
      accessorKey: "type",
      header: "Ölçüm Tipi",
    },
    {
      accessorKey: "value",
      header: "Değer",
      cell: ({ row }) => {
        const value = row.getValue("value");
        const unit = row.original.unit;
        return (
          <span>
            {value} {unit && <span className="text-gray-500">{unit}</span>}
          </span>
        );
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
      accessorKey: "enteredBy",
      header: "Ekleyen",
      cell: ({ row }) => {
        const enteredBy = row.getValue("enteredBy");
        return enteredBy === "patient" ? "Hasta" : "Doktor";
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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <GenericDataTable
      data={measurements}
      columns={columns}
      config={{
        entityName: "Ölçüm",
        entityNamePlural: "Ölçümler",
        searchField: "type",
        searchPlaceholder: "Ölçüm tipine göre filtrele...",
      }}
      actions={{
        onCreate: {
          enabled: true,
          component: null,
          usePage: true,
          pageUrl: `/patient/measurements/add`,
        },
        onEdit: {
          enabled: false,
        },
        onDelete: {
          enabled: true,
          customHandler: handleDelete,
          // Sadece hasta tarafından oluşturulan ölçümler için silme butonu göster
          showIf: (measurement) => measurement.enteredBy === "patient",
        },
      }}
    />
  );
}
