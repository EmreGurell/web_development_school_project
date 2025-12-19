import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";

export function SkeletonTable({
                                  columns = 5,
                                  rows = 6,
                                  showCreateButton = true,
                                  showColumnToggle = true,
                                  entityName = "Kayıt",
                              }) {
    return (
        <section>
            <div className="w-full">
                {/* Üst Araç Çubuğu */}
                <div className="flex items-center py-4">
                    <Skeleton className="h-10 w-60 rounded-md" />

                    {showColumnToggle && (
                        <Button variant="outline" disabled className="ml-auto">
                            Sütunlar <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    )}

                    {showCreateButton && (
                        <Button disabled className="ml-3">
                            <Plus className="w-4 h-4 mr-2" />
                            {entityName} Oluştur
                        </Button>
                    )}
                </div>

                {/* Tablo */}
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-100">
                            <TableRow>
                                {Array.from({ length: columns }).map((_, i) => (
                                    <TableHead key={i}>
                                        <Skeleton className="h-4 w-24" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {Array.from({ length: rows }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between py-4">
                    <Skeleton className="h-4 w-32" />

                    <div className="space-x-2 flex">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                </div>
            </div>
        </section>
    );
}
