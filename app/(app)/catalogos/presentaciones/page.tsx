"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CatalogTable, EstadoBadge, type Column } from "@/components/catalog-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import type { Presentacion } from "@/lib/types";

const schema = z.object({
  nombrePresentacion: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<Presentacion>[] = [
  { key: "presentacionId", label: "#" },
  { key: "nombrePresentacion", label: "Nombre" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function PresentacionesPage() {
  const { presentaciones, addPresentacion, updatePresentacion } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Presentacion | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true },
  });

  function openAdd() { setEditing(null); reset({ nombrePresentacion: "", descripcion: "", estadoActivo: true }); setOpen(true); }
  function openEdit(p: Presentacion) { setEditing(p); reset({ nombrePresentacion: p.nombrePresentacion, descripcion: p.descripcion ?? "", estadoActivo: p.estadoActivo }); setOpen(true); }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updatePresentacion({ ...editing, ...data }); toast.success("Presentación actualizada"); }
    else { addPresentacion(data); toast.success("Presentación creada"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Presentaciones</h2><p className="text-sm text-muted-foreground">Formas farmacéuticas de los medicamentos</p></div>
      <CatalogTable title="Presentaciones" addLabel="Agregar presentación" data={presentaciones} columns={columns} idKey="presentacionId" onAdd={openAdd} onEdit={openEdit} searchKeys={["nombrePresentacion"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Presentación" : "Nueva Presentación"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input {...register("nombrePresentacion")} aria-invalid={!!errors.nombrePresentacion} />
              {errors.nombrePresentacion && <p className="text-xs text-destructive">{errors.nombrePresentacion.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5"><Label>Descripción</Label><Textarea rows={2} {...register("descripcion")} /></div>
            <div className="flex items-center gap-3"><Switch checked={watch("estadoActivo")} onCheckedChange={(v) => setValue("estadoActivo", v)} /><Label>Estado activo</Label></div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
