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
import type { Categoria } from "@/lib/types";

const schema = z.object({
  nombreCategoria: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const columns: Column<Categoria>[] = [
  { key: "categoriaId", label: "#" },
  { key: "nombreCategoria", label: "Nombre" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function CategoriasPage() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { estadoActivo: true },
  });

  function openAdd() {
    setEditing(null);
    reset({ nombreCategoria: "", descripcion: "", estadoActivo: true });
    setOpen(true);
  }
  function openEdit(c: Categoria) {
    setEditing(c);
    reset({ nombreCategoria: c.nombreCategoria, descripcion: c.descripcion ?? "", estadoActivo: c.estadoActivo });
    setOpen(true);
  }
  async function onSubmit(data: FormValues) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) { updateCategoria({ ...editing, ...data }); toast.success("Categoría actualizada"); }
    else { addCategoria(data); toast.success("Categoría creada"); }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Categorías</h2><p className="text-sm text-muted-foreground">Gestión de categorías de medicamentos</p></div>
      <CatalogTable title="Categorías" addLabel="Agregar categoría" data={categorias} columns={columns} idKey="categoriaId" onAdd={openAdd} onEdit={openEdit} onDelete={deleteCategoria} searchKeys={["nombreCategoria"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombreCategoria">Nombre <span className="text-destructive">*</span></Label>
              <Input id="nombreCategoria" {...register("nombreCategoria")} aria-invalid={!!errors.nombreCategoria} />
              {errors.nombreCategoria && <p className="text-xs text-destructive">{errors.nombreCategoria.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="desc">Descripción</Label><Textarea id="desc" rows={2} {...register("descripcion")} /></div>
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
