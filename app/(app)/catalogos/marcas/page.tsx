"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { CatalogTable, EstadoBadge, type Column } from "@/components/catalog-table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import type { Marca } from "@/lib/types";

const schema = z.object({
  nombreMarca: z.string().min(1, "El nombre es requerido").max(100),
  descripcion: z.string().optional(),
  estadoActivo: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const columns: Column<Marca>[] = [
  { key: "marcaId", label: "#" },
  { key: "nombreMarca", label: "Nombre" },
  { key: "descripcion", label: "Descripción", render: (r) => r.descripcion ?? "—" },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function MarcasPage() {
  const { marcas, addMarca, updateMarca, deleteMarca } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Marca | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { estadoActivo: true },
  });

  function openAdd() {
    setEditing(null);
    reset({ nombreMarca: "", descripcion: "", estadoActivo: true });
    setOpen(true);
  }

  function openEdit(m: Marca) {
    setEditing(m);
    reset({ nombreMarca: m.nombreMarca, descripcion: m.descripcion ?? "", estadoActivo: m.estadoActivo });
    setOpen(true);
  }

  async function onSubmit(data: FormValues) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) {
      updateMarca({ ...editing, ...data });
      toast.success("Marca actualizada correctamente");
    } else {
      addMarca(data);
      toast.success("Marca creada correctamente");
    }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-foreground">Marcas</h2>
        <p className="text-sm text-muted-foreground">Gestión de marcas de productos farmacéuticos</p>
      </div>

      <CatalogTable
        title="Marcas"
        addLabel="Agregar marca"
        data={marcas}
        columns={columns}
        idKey="marcaId"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={deleteMarca}
        searchKeys={["nombreMarca", "descripcion"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombreMarca">Nombre <span className="text-destructive">*</span></Label>
              <Input id="nombreMarca" {...register("nombreMarca")} aria-invalid={!!errors.nombreMarca} />
              {errors.nombreMarca && <p className="text-xs text-destructive">{errors.nombreMarca.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" rows={2} {...register("descripcion")} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={watch("estadoActivo")} onCheckedChange={(v) => setValue("estadoActivo", v)} />
              <Label>Estado activo</Label>
            </div>
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
