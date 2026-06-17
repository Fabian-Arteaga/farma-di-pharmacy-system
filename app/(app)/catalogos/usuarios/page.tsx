"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CatalogTable, EstadoBadge, type Column } from "@/components/catalog-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Usuario } from "@/lib/types";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  correoElectronico: z.string().email("Correo inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  nombreUsuario: z.string().min(3, "Mínimo 3 caracteres"),
  rol: z.string().min(1, "Seleccione un rol"),
  estadoActivo: z.boolean(),
});
type F = z.infer<typeof schema>;

const columns: Column<Usuario>[] = [
  { key: "usuarioId", label: "#" },
  { key: "nombre", label: "Nombre", render: (r) => `${r.nombre} ${r.apellido}` },
  { key: "correoElectronico", label: "Correo" },
  { key: "telefono", label: "Teléfono" },
  { key: "roles", label: "Rol", render: (r) => <Badge variant="secondary">{r.roles[0] ?? "—"}</Badge> },
  { key: "fechaCreacion", label: "Creado", render: (r) => format(new Date(r.fechaCreacion), "dd/MM/yyyy") },
  { key: "estadoActivo", label: "Estado", render: (r) => <EstadoBadge activo={r.estadoActivo} /> },
];

export default function UsuariosPage() {
  const { usuarios, roles, addUsuario, updateUsuario } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema), defaultValues: { estadoActivo: true, rol: "" },
  });

  function openAdd() {
    setEditing(null);
    reset({ nombre: "", apellido: "", correoElectronico: "", telefono: "", nombreUsuario: "", rol: "", estadoActivo: true });
    setOpen(true);
  }
  function openEdit(u: Usuario) {
    setEditing(u);
    reset({ nombre: u.nombre, apellido: u.apellido, correoElectronico: u.correoElectronico, telefono: u.telefono, nombreUsuario: u.nombreUsuario, rol: u.roles[0] ?? "", estadoActivo: u.estadoActivo });
    setOpen(true);
  }
  async function onSubmit(data: F) {
    await new Promise((r) => setTimeout(r, 300));
    if (editing) {
      updateUsuario({ ...editing, nombre: data.nombre, apellido: data.apellido, correoElectronico: data.correoElectronico, telefono: data.telefono, nombreUsuario: data.nombreUsuario, estadoActivo: data.estadoActivo, roles: [data.rol] });
      toast.success("Usuario actualizado");
    } else {
      addUsuario({ nombre: data.nombre, apellido: data.apellido, correoElectronico: data.correoElectronico, telefono: data.telefono, nombreUsuario: data.nombreUsuario, estadoActivo: data.estadoActivo, roles: [data.rol] });
      toast.success("Usuario creado");
    }
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-bold">Usuarios</h2><p className="text-sm text-muted-foreground">Gestión de cuentas de acceso al sistema</p></div>
      <CatalogTable title="Usuarios" addLabel="Agregar usuario" data={usuarios} columns={columns} idKey="usuarioId" onAdd={openAdd} onEdit={openEdit} searchKeys={["nombre", "apellido", "correoElectronico", "nombreUsuario"]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Nombre <span className="text-destructive">*</span></Label>
                <Input {...register("nombre")} aria-invalid={!!errors.nombre} />
                {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Apellido <span className="text-destructive">*</span></Label>
                <Input {...register("apellido")} aria-invalid={!!errors.apellido} />
                {errors.apellido && <p className="text-xs text-destructive">{errors.apellido.message}</p>}
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Correo Electrónico <span className="text-destructive">*</span></Label>
                <Input type="email" {...register("correoElectronico")} aria-invalid={!!errors.correoElectronico} />
                {errors.correoElectronico && <p className="text-xs text-destructive">{errors.correoElectronico.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Teléfono <span className="text-destructive">*</span></Label>
                <Input placeholder="8888-0000" {...register("telefono")} aria-invalid={!!errors.telefono} />
                {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Nombre de usuario <span className="text-destructive">*</span></Label>
                <Input {...register("nombreUsuario")} aria-invalid={!!errors.nombreUsuario} />
                {errors.nombreUsuario && <p className="text-xs text-destructive">{errors.nombreUsuario.message}</p>}
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Rol <span className="text-destructive">*</span></Label>
                <Select value={watch("rol")} onValueChange={(v) => setValue("rol", v)}>
                  <SelectTrigger aria-invalid={!!errors.rol}><SelectValue placeholder="Seleccionar rol..." /></SelectTrigger>
                  <SelectContent>{roles.filter(r => r.estadoActivo).map(r => <SelectItem key={r.rolId} value={r.nombreRol}>{r.nombreRol}</SelectItem>)}</SelectContent>
                </Select>
                {errors.rol && <p className="text-xs text-destructive">{errors.rol.message}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={watch("estadoActivo")} onCheckedChange={(v) => setValue("estadoActivo", v)} /><Label>Cuenta activa</Label></div>
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
