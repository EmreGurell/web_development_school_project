"use client";

import {SkeletonTable} from "@/components/ui/skeleton_table";
import {error} from "next/dist/build/output/log";
import MeasurementsTable from "@/app/patient/measurements/measurement_table";

export default function MeasurementsPage(){

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Ölçümlerim</h2>
            {/*{loading && <SkeletonTable/>}*/}
            {/*{error && <div className="alert alert-danger">Hata: {error}</div>}*/}

            {/*{!loading && !error && (*/}
            {/*    <div>*/}
              <MeasurementsTable/>
            {/*    </div>*/}
            {/*)}*/}
        </section>
    );
}