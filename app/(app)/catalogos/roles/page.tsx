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
import type { Rol } from "@/lib/types";

const schema = z.object({
  nombreRol: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<Rol>[] = [
  { key: "rolId", label: "#" },
  { key: "nombreRol", label: "Nombre del Rol" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function RolesPage() {
  const { roles, addRol, updateRol } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rol | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true },
  });

  function openAdd() { setEditing(null); reset({ nombreRol: "", descripcion: "", estadoActivo: true }); setOpen(true); }
  function openEdit(r: Rol) { setEditing(r); reset({ nombreRol: r.nombreRol, descripcion: r.descripcion ?? "", estadoActivo: r.estadoActivo }); setOpen(true); }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updateRol({ ...editing, ...data }); toast.success("Rol actualizado"); }
    else { addRol(data); toast.success("Rol creado"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Roles</h2><p className="text-sm text-muted-foreground">Perfiles de acceso del sistema</p></div>
      <CatalogTable title="Roles" addLabel="Agregar rol" data={roles} columns={columns} idKey="rolId" onAdd={openAdd} onEdit={openEdit} searchKeys={["nombreRol"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Rol" : "Nuevo Rol"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input {...register("nombreRol")} aria-invalid={!!errors.nombreRol} />
              {errors.nombreRol && <p className="text-xs text-destructive">{errors.nombreRol.message}</p>}
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
