"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { CatalogTable, EstadoBadge, type Column } from "@/components/catalog-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { Concentracion } from "@/lib/types";

const schema = z.object({
  valorConcentracion: z.string().min(1, "El valor es requerido"),
  unidadConcentracion: z.string().min(1, "La unidad es requerida"),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const UNIDADES = ["mg", "g", "mcg", "ml", "mg/5ml", "mg/ml", "UI", "%"];

const columns: Column<Concentracion>[] = [
  { key: "concentracionId", label: "#" },
  { key: "valorConcentracion", label: "Valor" },
  { key: "unidadConcentracion", label: "Unidad" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function ConcentracionesPage() {
  const { concentraciones, addConcentracion, updateConcentracion } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Concentracion | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true, unidadConcentracion: "mg" },
  });

  function openAdd() { setEditing(null); reset({ valorConcentracion: "", unidadConcentracion: "mg", descripcion: "", estadoActivo: true }); setOpen(true); }
  function openEdit(c: Concentracion) { setEditing(c); reset({ valorConcentracion: c.valorConcentracion, unidadConcentracion: c.unidadConcentracion, descripcion: c.descripcion ?? "", estadoActivo: c.estadoActivo }); setOpen(true); }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updateConcentracion({ ...editing, ...data }); toast.success("Concentración actualizada"); }
    else { addConcentracion(data); toast.success("Concentración creada"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-foreground">Concentraciones</h2>
        <p className="text-sm text-muted-foreground">Valores y unidades de concentración de medicamentos</p>
      </div>
      <CatalogTable title="Concentraciones" addLabel="Agregar concentración" data={concentraciones} columns={columns} idKey="concentracionId" onAdd={openAdd} onEdit={openEdit} searchKeys={["valorConcentracion", "unidadConcentracion"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Concentración" : "Nueva Concentración"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Valor <span className="text-destructive">*</span></Label>
                <Input placeholder="ej: 500" {...register("valorConcentracion")} aria-invalid={!!errors.valorConcentracion} />
                {errors.valorConcentracion && <p className="text-xs text-destructive">{errors.valorConcentracion.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Unidad <span className="text-destructive">*</span></Label>
                <Select value={watch("unidadConcentracion")} onValueChange={(v) => setValue("unidadConcentracion", v ?? "mg")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{UNIDADES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5"><Label>Descripción</Label><Input {...register("descripcion")} /></div>
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
