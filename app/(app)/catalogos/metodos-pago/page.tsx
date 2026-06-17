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
import type { MetodoPago } from "@/lib/types";

const schema = z.object({
  nombreMetodoPago: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<MetodoPago>[] = [
  { key: "metodoPagoId", label: "#" },
  { key: "nombreMetodoPago", label: "Nombre" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function MetodosPagoPage() {
  const { metodosPago, addMetodoPago, updateMetodoPago } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MetodoPago | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true },
  });

  function openAdd() { setEditing(null); reset({ nombreMetodoPago: "", descripcion: "", estadoActivo: true }); setOpen(true); }
  function openEdit(m: MetodoPago) { setEditing(m); reset({ nombreMetodoPago: m.nombreMetodoPago, descripcion: m.descripcion ?? "", estadoActivo: m.estadoActivo }); setOpen(true); }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updateMetodoPago({ ...editing, ...data }); toast.success("Método de pago actualizado"); }
    else { addMetodoPago(data); toast.success("Método de pago creado"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Métodos de Pago</h2><p className="text-sm text-muted-foreground">Formas de pago disponibles para transacciones</p></div>
      <CatalogTable title="Métodos de Pago" addLabel="Agregar método de pago" data={metodosPago} columns={columns} idKey="metodoPagoId" onAdd={openAdd} onEdit={openEdit} searchKeys={["nombreMetodoPago"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Método de Pago" : "Nuevo Método de Pago"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input {...register("nombreMetodoPago")} aria-invalid={!!errors.nombreMetodoPago} />
              {errors.nombreMetodoPago && <p className="text-xs text-destructive">{errors.nombreMetodoPago.message}</p>}
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
