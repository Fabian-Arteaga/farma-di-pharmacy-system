"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccesoDenegadoPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldX className="size-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold">Acceso Denegado</h1>
        <p className="text-sm text-muted-foreground">
          No tiene permisos para acceder a esta sección. Contacte al administrador del sistema.
        </p>
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
}
