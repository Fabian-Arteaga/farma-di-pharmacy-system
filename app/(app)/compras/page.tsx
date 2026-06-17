"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash2, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import type { DetalleCompra, Compra } from "@/lib/types";

function formatC(n: number) {
  return `C$ ${n.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;
}

const lineaSchema = z.object({
  productoId: z.coerce.number().min(1, "Seleccione un producto"),
  cantidad: z.coerce.number().int().positive("Debe ser mayor a 0"),
  precioUnitarioCompra: z.coerce.number().positive("Precio requerido"),
  descuentoLinea: z.coerce.number().min(0),
});
type LineaForm = {
  productoId: number;
  cantidad: number;
  precioUnitarioCompra: number;
  descuentoLinea: number;
};

const compraSchema = z.object({
  proveedorId: z.coerce.number().min(1, "Seleccione un proveedor"),
  descuentoTotal: z.coerce.number().min(0),
  observaciones: z.string().optional(),
});
type CompraForm = {
  proveedorId: number;
  descuentoTotal: number;
  observaciones?: string;
};

export default function ComprasPage() {
  const { compras, productos, proveedores, addCompra } = useStore();
  const { user } = useAuth();

  // List view
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCompra, setViewCompra] = useState<Compra | null>(null);

  // New purchase dialog
  const [newOpen, setNewOpen] = useState(false);
  const [lineas, setLineas] = useState<DetalleCompra[]>([]);

  const {
    register: rC, handleSubmit: hC, reset: resetC,
    watch: wC, setValue: svC, formState: { errors: eC },
  } = useForm<CompraForm>({ resolver: zodResolver(compraSchema), defaultValues: { descuentoTotal: 0 } });

  const {
    register: rL, handleSubmit: hL, reset: resetL,
    watch: wL, setValue: svL, formState: { errors: eL },
  } = useForm<LineaForm>({ resolver: zodResolver(lineaSchema), defaultValues: { descuentoLinea: 0 } });

  const filteredCompras = compras.filter((c) =>
    search.trim()
      ? c.numeroCompra.toLowerCase().includes(search.toLowerCase()) ||
        (c.proveedorNombre ?? "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  function openNew() {
    setLineas([]);
    resetC({ proveedorId: 0, descuentoTotal: 0, observaciones: "" });
    resetL({ productoId: 0, cantidad: 1, precioUnitarioCompra: 0, descuentoLinea: 0 });
    setNewOpen(true);
  }

  function addLinea(data: LineaForm) {
    const prod = productos.find((p) => p.productoId === data.productoId);
    const subtotal = data.cantidad * data.precioUnitarioCompra;
    const total = subtotal - (data.descuentoLinea ?? 0);
    setLineas((prev) => [
      ...prev,
      {
        productoId: data.productoId,
        productoNombre: prod ? `${prod.nombreGenerico} (${prod.concentracionDescripcion ?? ""})` : "",
        cantidad: data.cantidad,
        precioUnitarioCompra: data.precioUnitarioCompra,
        descuentoLinea: data.descuentoLinea ?? 0,
        subtotalLinea: subtotal,
        totalLinea: total,
      },
    ]);
    resetL({ productoId: 0, cantidad: 1, precioUnitarioCompra: 0, descuentoLinea: 0 });
  }

  const subtotalLineas = lineas.reduce((s, l) => s + l.subtotalLinea, 0);
  const descuentoExtra = Number(wC("descuentoTotal") ?? 0);
  const totalCompra = subtotalLineas - descuentoExtra;

  async function onSubmitCompra(data: CompraForm) {
    if (lineas.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }
    const prov = proveedores.find((p) => p.proveedorId === data.proveedorId);
    addCompra({
      proveedorId: data.proveedorId,
      proveedorNombre: prov?.nombreProveedor,
      usuarioId: user!.usuarioId,
      usuarioNombre: `${user!.nombre} ${user!.apellido}`,
      fechaCompra: new Date().toISOString(),
      subtotal: subtotalLineas,
      descuentoTotal: data.descuentoTotal,
      totalCompra,
      observaciones: data.observaciones,
      detalles: lineas,
    });
    toast.success("Compra registrada exitosamente");
    setNewOpen(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-foreground">Compras</h2>
        <p className="text-sm text-muted-foreground">Registro y consulta de órdenes de compra a proveedores</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Input
          placeholder="Buscar por número o proveedor..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={openNew} size="sm">
          <Plus data-icon="inline-start" />
          Nueva compra
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">N° Compra</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Proveedor</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Fecha</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Responsable</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Descuento</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">Total</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No hay compras registradas.
                </TableCell>
              </TableRow>
            ) : (
              [...filteredCompras]
                .sort((a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime())
                .map((c) => (
                  <TableRow key={c.compraId} className="group">
                    <TableCell className="font-medium text-sm">{c.numeroCompra}</TableCell>
                    <TableCell className="text-sm">{c.proveedorNombre}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(c.fechaCompra), "dd/MM/yyyy HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.usuarioNombre}</TableCell>
                    <TableCell className="text-sm">
                      {c.descuentoTotal > 0 ? (
                        <Badge variant="outline" className="text-chart-3 border-chart-3/40">
                          -{formatC(c.descuentoTotal)}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatC(c.totalCompra)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100"
                        onClick={() => { setViewCompra(c); setViewOpen(true); }}
                      >
                        <Eye className="size-3.5" />
                        <span className="sr-only">Ver detalle</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        {filteredCompras.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/20">
            {filteredCompras.length} {filteredCompras.length === 1 ? "compra" : "compras"}
          </div>
        )}
      </div>

      {/* View detail dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Compra — {viewCompra?.numeroCompra}</DialogTitle>
          </DialogHeader>
          {viewCompra && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Proveedor</p><p className="font-medium">{viewCompra.proveedorNombre}</p></div>
                <div><p className="text-muted-foreground text-xs">Fecha</p><p className="font-medium">{format(new Date(viewCompra.fechaCompra), "dd/MM/yyyy HH:mm", { locale: es })}</p></div>
                <div><p className="text-muted-foreground text-xs">Responsable</p><p className="font-medium">{viewCompra.usuarioNombre}</p></div>
                {viewCompra.observaciones && <div className="col-span-2"><p className="text-muted-foreground text-xs">Observaciones</p><p className="font-medium">{viewCompra.observaciones}</p></div>}
              </div>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">P. Unitario</TableHead>
                    <TableHead className="text-right">Descuento</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(viewCompra.detalles ?? []).map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{d.productoNombre}</TableCell>
                      <TableCell className="text-right text-sm">{d.cantidad}</TableCell>
                      <TableCell className="text-right text-sm">{formatC(d.precioUnitarioCompra)}</TableCell>
                      <TableCell className="text-right text-sm">{d.descuentoLinea > 0 ? formatC(d.descuentoLinea) : "—"}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatC(d.totalLinea)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex gap-8"><span className="text-muted-foreground">Subtotal:</span><span>{formatC(viewCompra.subtotal)}</span></div>
                {viewCompra.descuentoTotal > 0 && <div className="flex gap-8"><span className="text-muted-foreground">Descuento:</span><span className="text-destructive">-{formatC(viewCompra.descuentoTotal)}</span></div>}
                <Separator className="w-48 my-1" />
                <div className="flex gap-8 font-bold text-base"><span>Total:</span><span>{formatC(viewCompra.totalCompra)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Purchase Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Compra</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* Purchase header */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Proveedor <span className="text-destructive">*</span></Label>
                <Select
                  value={wC("proveedorId") > 0 ? String(wC("proveedorId")) : ""}
                  onValueChange={(v) => svC("proveedorId", Number(v))}
                >
                  <SelectTrigger aria-invalid={!!eC.proveedorId}>
                    <SelectValue placeholder="Seleccionar proveedor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.filter(p => p.estadoActivo).map((p) => (
                      <SelectItem key={p.proveedorId} value={String(p.proveedorId)}>{p.nombreProveedor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {eC.proveedorId && <p className="text-xs text-destructive">{eC.proveedorId.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Descuento Global (C$)</Label>
                <Input type="number" min={0} step="0.01" {...rC("descuentoTotal")} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Observaciones</Label>
                <Textarea rows={2} {...rC("observaciones")} placeholder="Notas opcionales..." />
              </div>
            </div>

            <Separator />

            {/* Add product line */}
            <div>
              <p className="text-sm font-semibold mb-3">Agregar Producto</p>
              <form onSubmit={hL(addLinea)} className="grid grid-cols-4 gap-2 items-end">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label className="text-xs">Producto <span className="text-destructive">*</span></Label>
                  <Select
                    value={wL("productoId") > 0 ? String(wL("productoId")) : ""}
                    onValueChange={(v) => svL("productoId", Number(v))}
                  >
                    <SelectTrigger className="h-9" aria-invalid={!!eL.productoId}>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.filter(p => p.estadoActivo).map((p) => (
                        <SelectItem key={p.productoId} value={String(p.productoId)}>
                          {p.nombreGenerico} — {p.concentracionDescripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {eL.productoId && <p className="text-xs text-destructive">{eL.productoId.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Cantidad <span className="text-destructive">*</span></Label>
                  <Input type="number" min={1} className="h-9" {...rL("cantidad")} aria-invalid={!!eL.cantidad} />
                  {eL.cantidad && <p className="text-xs text-destructive">{eL.cantidad.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Precio Compra <span className="text-destructive">*</span></Label>
                  <Input type="number" min={0} step="0.01" className="h-9" {...rL("precioUnitarioCompra")} aria-invalid={!!eL.precioUnitarioCompra} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Descuento Línea</Label>
                  <Input type="number" min={0} step="0.01" className="h-9" {...rL("descuentoLinea")} />
                </div>
                <div className="col-span-3" />
                <Button type="submit" size="sm" variant="outline" className="h-9">
                  <Plus data-icon="inline-start" />
                  Agregar
                </Button>
              </form>
            </div>

            {/* Lines table */}
            {lineas.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cant.</TableHead>
                      <TableHead className="text-right">P.Unit.</TableHead>
                      <TableHead className="text-right">Desc.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineas.map((l, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{l.productoNombre}</TableCell>
                        <TableCell className="text-right text-sm">{l.cantidad}</TableCell>
                        <TableCell className="text-right text-sm">{formatC(l.precioUnitarioCompra)}</TableCell>
                        <TableCell className="text-right text-sm">{l.descuentoLinea > 0 ? formatC(l.descuentoLinea) : "—"}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatC(l.totalLinea)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive"
                            onClick={() => setLineas((p) => p.filter((_, j) => j !== i))}
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals summary */}
            <Card className="bg-muted/30">
              <CardContent className="py-3 flex flex-col items-end gap-1 text-sm">
                <div className="flex gap-10"><span className="text-muted-foreground">Subtotal:</span><span>{formatC(subtotalLineas)}</span></div>
                <div className="flex gap-10"><span className="text-muted-foreground">Descuento:</span><span className="text-destructive">-{formatC(descuentoExtra)}</span></div>
                <Separator className="w-44 my-1" />
                <div className="flex gap-10 font-bold text-base"><span>Total Compra:</span><span className="text-primary">{formatC(totalCompra)}</span></div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button onClick={hC(onSubmitCompra)} disabled={lineas.length === 0}>
              <ShoppingCart data-icon="inline-start" />
              Registrar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
