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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import type { Proveedor } from "@/lib/types";

const schema = z.object({
  nombreProveedor: z.string().min(1, "El nombre es requerido"),
  rnc: z.string().optional(),
  correoElectronico: z.string().email("Correo inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<Proveedor>[] = [
  { key: "proveedorId", label: "#" },
  { key: "nombreProveedor", label: "Nombre" },
  { key: "correoElectronico", label: "Correo" },
  { key: "telefono", label: "Teléfono" },
  { key: "direccion", label: "Dirección", render: (r) => <span className="truncate max-w-[200px] block">{r.direccion}</span> },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function ProveedoresPage() {
  const { proveedores, addProveedor, updateProveedor } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true },
  });

  function openAdd() { setEditing(null); reset({ nombreProveedor: "", rnc: "", correoElectronico: "", telefono: "", direccion: "", estadoActivo: true }); setOpen(true); }
  function openEdit(p: Proveedor) { setEditing(p); reset({ nombreProveedor: p.nombreProveedor, rnc: p.rnc ?? "", correoElectronico: p.correoElectronico, telefono: p.telefono, direccion: p.direccion, estadoActivo: p.estadoActivo }); setOpen(true); }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updateProveedor({ ...editing, ...data }); toast.success("Proveedor actualizado"); }
    else { addProveedor(data); toast.success("Proveedor creado"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-foreground">Proveedores</h2>
        <p className="text-sm text-muted-foreground">Empresas distribuidoras y proveedoras de medicamentos</p>
      </div>
      <CatalogTable title="Proveedores" addLabel="Agregar proveedor" data={proveedores} columns={columns} idKey="proveedorId" onAdd={openAdd} onEdit={openEdit} searchKeys={["nombreProveedor", "correoElectronico"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Nombre <span className="text-destructive">*</span></Label>
                <Input {...register("nombreProveedor")} aria-invalid={!!errors.nombreProveedor} />
                {errors.nombreProveedor && <p className="text-xs text-destructive">{errors.nombreProveedor.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>RNC / RUC</Label>
                <Input placeholder="Opcional" {...register("rnc")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Teléfono <span className="text-destructive">*</span></Label>
                <Input placeholder="2552-0000" {...register("telefono")} aria-invalid={!!errors.telefono} />
                {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Correo Electrónico <span className="text-destructive">*</span></Label>
                <Input type="email" {...register("correoElectronico")} aria-invalid={!!errors.correoElectronico} />
                {errors.correoElectronico && <p className="text-xs text-destructive">{errors.correoElectronico.message}</p>}
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Dirección <span className="text-destructive">*</span></Label>
                <Textarea rows={2} {...register("direccion")} aria-invalid={!!errors.direccion} />
                {errors.direccion && <p className="text-xs text-destructive">{errors.direccion.message}</p>}
              </div>
            </div>
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
