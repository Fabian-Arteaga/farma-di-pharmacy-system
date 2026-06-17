"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { format } from "date-fns";
import { CatalogTable, EstadoBadge, type Column } from "@/components/catalog-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useIsAdmin } from "@/lib/auth-context";
import type { Producto } from "@/lib/types";

const schema = z.object({
  nombreGenerico: z.string().min(1, "El nombre genérico es requerido"),
  nombreComercial: z.string().optional(),
  categoriaId: z.coerce.number().min(1, "Seleccione una categoría"),
  presentacionId: z.coerce.number().min(1, "Seleccione una presentación"),
  concentracionId: z.coerce.number().min(1, "Seleccione una concentración"),
  proveedorId: z.coerce.number().min(1, "Seleccione un proveedor"),
  marcaId: z.coerce.number().min(1, "Seleccione una marca"),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<Producto>[] = [
  { key: "productoId", label: "#" },
  { key: "nombreGenerico", label: "Nombre Genérico" },
  { key: "nombreComercial", label: "Nombre Comercial", render: (r) => r.nombreComercial ?? "—" },
  { key: "categoriaNombre", label: "Categoría", render: (r) => r.categoriaNombre ?? "—" },
  { key: "presentacionNombre", label: "Presentación", render: (r) => r.presentacionNombre ?? "—" },
  { key: "concentracionDescripcion", label: "Concentración", render: (r) => r.concentracionDescripcion ?? "—" },
  { key: "marcaNombre", label: "Marca", render: (r) => r.marcaNombre ?? "—" },
  { key: "fechaCreacion", label: "Creado", render: (r) => format(new Date(r.fechaCreacion), "dd/MM/yyyy") },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function ProductosPage() {
  const { productos, categorias, presentaciones, concentraciones, proveedores, marcas, addProducto, updateProducto, deleteProducto } = useStore();
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true },
  });

  function openAdd() {
    setEditing(null);
    reset({ nombreGenerico: "", nombreComercial: "", categoriaId: 0, presentacionId: 0, concentracionId: 0, proveedorId: 0, marcaId: 0, estadoActivo: true });
    setOpen(true);
  }
  function openEdit(p: Producto) {
    setEditing(p);
    reset({ nombreGenerico: p.nombreGenerico, nombreComercial: p.nombreComercial ?? "", categoriaId: p.categoriaId, presentacionId: p.presentacionId, concentracionId: p.concentracionId, proveedorId: p.proveedorId, marcaId: p.marcaId, estadoActivo: p.estadoActivo });
    setOpen(true);
  }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) {
      updateProducto({ ...editing, ...data });
      toast.success("Producto actualizado");
    } else {
      addProducto(data);
      toast.success("Producto creado");
    }
    setOpen(false);
  }

  const Select2 = ({ id, label, required, options, value, onChange, error }: { id: string; label: string; required?: boolean; options: { value: number; label: string }[]; value: number; onChange: (v: string | null) => void; error?: string }) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
              <Select value={value > 0 ? String(value) : ""} onValueChange={(v) => onChange(v)}>
        <SelectTrigger id={id} aria-invalid={!!error}><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
        <SelectContent>{options.map(o => <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Productos</h2><p className="text-sm text-muted-foreground">Catálogo de medicamentos disponibles en la farmacia</p></div>
      <CatalogTable
        title="Productos" addLabel="Agregar producto" data={productos} columns={columns} idKey="productoId"
        onAdd={openAdd} onEdit={openEdit} onDelete={isAdmin ? deleteProducto : undefined}
        searchKeys={["nombreGenerico", "nombreComercial", "categoriaNombre", "marcaNombre"]}
        canWrite={isAdmin}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Nombre Genérico <span className="text-destructive">*</span></Label>
                <Input {...register("nombreGenerico")} aria-invalid={!!errors.nombreGenerico} />
                {errors.nombreGenerico && <p className="text-xs text-destructive">{errors.nombreGenerico.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Nombre Comercial</Label>
                <Input {...register("nombreComercial")} placeholder="Opcional" />
              </div>
              <Select2 id="cat" label="Categoría" required options={categorias.filter(c => c.estadoActivo).map(c => ({ value: c.categoriaId, label: c.nombreCategoria }))} value={watch("categoriaId")} onChange={(v) => setValue("categoriaId", Number(v ?? 0))} error={errors.categoriaId?.message} />
              <Select2 id="pres" label="Presentación" required options={presentaciones.filter(p => p.estadoActivo).map(p => ({ value: p.presentacionId, label: p.nombrePresentacion }))} value={watch("presentacionId")} onChange={(v) => setValue("presentacionId", Number(v ?? 0))} error={errors.presentacionId?.message} />
              <Select2 id="conc" label="Concentración" required options={concentraciones.filter(c => c.estadoActivo).map(c => ({ value: c.concentracionId, label: `${c.valorConcentracion} ${c.unidadConcentracion}` }))} value={watch("concentracionId")} onChange={(v) => setValue("concentracionId", Number(v ?? 0))} error={errors.concentracionId?.message} />
              <Select2 id="prov" label="Proveedor" required options={proveedores.filter(p => p.estadoActivo).map(p => ({ value: p.proveedorId, label: p.nombreProveedor }))} value={watch("proveedorId")} onChange={(v) => setValue("proveedorId", Number(v ?? 0))} error={errors.proveedorId?.message} />
              <Select2 id="marc" label="Marca" required options={marcas.filter(m => m.estadoActivo).map(m => ({ value: m.marcaId, label: m.nombreMarca }))} value={watch("marcaId")} onChange={(v) => setValue("marcaId", Number(v ?? 0))} error={errors.marcaId?.message} />
            </div>
            <div className="flex items-center gap-3"><Switch checked={watch("estadoActivo")} onCheckedChange={(v) => setValue("estadoActivo", v)} /><Label>Producto activo</Label></div>
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
