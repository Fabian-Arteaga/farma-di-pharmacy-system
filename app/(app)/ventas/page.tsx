"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash2, Receipt, Eye, Search, ShoppingBag, Minus, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import type { DetalleVenta, Factura } from "@/lib/types";

function formatC(n: number) {
  return `C$ ${n.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;
}

type CarritoItem = DetalleVenta & { stockDisponible: number };

const METODO_EFECTIVO_NOMBRE = "Efectivo";

export default function VentasPage() {
  const { facturas, metodosPago, productos, inventario, addFactura } = useStore();
  const { user } = useAuth();

  // History view
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewFactura, setViewFactura] = useState<Factura | null>(null);

  // New sale POS
  const [newOpen, setNewOpen] = useState(false);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [productoSearch, setProductoSearch] = useState("");
  const [metodoPagoId, setMetodoPagoId] = useState<number>(0);
  const [nombreCliente, setNombreCliente] = useState("");
  const [descuentoGlobal, setDescuentoGlobal] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [montoRecibido, setMontoRecibido] = useState<string>("");

  // Filtered history
  const filteredFacturas = useMemo(() =>
    facturas.filter((f) =>
      search.trim()
        ? f.numeroFactura.toLowerCase().includes(search.toLowerCase()) ||
          (f.nombreCliente ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (f.metodoPagoNombre ?? "").toLowerCase().includes(search.toLowerCase())
        : true
    ).sort((a, b) => new Date(b.fechaFactura).getTime() - new Date(a.fechaFactura).getTime()),
    [facturas, search]
  );

  // Producto search for POS
  const productosConStock = useMemo(() =>
    productos
      .filter((p) => p.estadoActivo)
      .map((p) => {
        const stock = inventario.find((i) => i.productoId === p.productoId);
        return {
          ...p,
          stock: stock?.cantidadDisponible ?? 0,
          precioVenta: stock?.precioVenta ?? 0,
        };
      })
      .filter((p) => p.stock > 0),
    [productos, inventario]
  );

  const productosFiltrados = useMemo(() =>
    productoSearch.trim()
      ? productosConStock.filter((p) =>
          `${p.nombreGenerico} ${p.nombreComercial ?? ""} ${p.concentracionDescripcion ?? ""}`
            .toLowerCase()
            .includes(productoSearch.toLowerCase())
        )
      : productosConStock.slice(0, 12),
    [productosConStock, productoSearch]
  );

  // Totals
  const subtotal = carrito.reduce((s, i) => s + i.subtotalLinea, 0);
  const totalDescLineas = carrito.reduce((s, i) => s + i.descuentoLinea, 0);
  const totalDesc = totalDescLineas + descuentoGlobal;
  const total = Math.max(0, subtotal - totalDesc);

  // Payment method helpers
  const selectedMetodo = metodosPago.find((m) => m.metodoPagoId === metodoPagoId);
  const esEfectivo = selectedMetodo?.nombreMetodoPago === METODO_EFECTIVO_NOMBRE;
  const montoRecibidoNum = parseFloat(montoRecibido) || 0;
  const cambio = esEfectivo ? Math.max(0, montoRecibidoNum - total) : 0;
  const montoInsuficiente = esEfectivo && total > 0 && montoRecibidoNum < total;

  function agregarAlCarrito(productoId: number) {
    const prod = productosConStock.find((p) => p.productoId === productoId);
    if (!prod) return;
    setCarrito((prev) => {
      const existing = prev.find((i) => i.productoId === productoId);
      if (existing) {
        if (existing.cantidad >= prod.stock) {
          toast.error(`Stock insuficiente. Disponible: ${prod.stock}`);
          return prev;
        }
        const qty = existing.cantidad + 1;
        return prev.map((i) =>
          i.productoId === productoId
            ? {
                ...i,
                cantidad: qty,
                subtotalLinea: qty * i.precioUnitarioVenta,
                totalLinea: qty * i.precioUnitarioVenta - i.descuentoLinea,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          productoId,
          productoNombre: `${prod.nombreGenerico} (${prod.concentracionDescripcion ?? ""})`,
          cantidad: 1,
          precioUnitarioVenta: prod.precioVenta,
          descuentoLinea: 0,
          subtotalLinea: prod.precioVenta,
          totalLinea: prod.precioVenta,
          stockDisponible: prod.stock,
        },
      ];
    });
  }

  function cambiarCantidad(productoId: number, delta: number) {
    setCarrito((prev) =>
      prev.map((i) => {
        if (i.productoId !== productoId) return i;
        const newQty = Math.max(1, Math.min(i.stockDisponible, i.cantidad + delta));
        return {
          ...i,
          cantidad: newQty,
          subtotalLinea: newQty * i.precioUnitarioVenta,
          totalLinea: newQty * i.precioUnitarioVenta - i.descuentoLinea,
        };
      })
    );
  }

  function cambiarDescuentoLinea(productoId: number, desc: number) {
    setCarrito((prev) =>
      prev.map((i) => {
        if (i.productoId !== productoId) return i;
        const d = Math.max(0, Math.min(desc, i.subtotalLinea));
        return { ...i, descuentoLinea: d, totalLinea: i.subtotalLinea - d };
      })
    );
  }

  function quitarDelCarrito(productoId: number) {
    setCarrito((prev) => prev.filter((i) => i.productoId !== productoId));
  }

  function openNew() {
    setCarrito([]);
    setProductoSearch("");
    setMetodoPagoId(0);
    setNombreCliente("");
    setDescuentoGlobal(0);
    setObservaciones("");
    setMontoRecibido("");
    setNewOpen(true);
  }

  function confirmarVenta() {
    if (carrito.length === 0) {
      toast.error("Agregue al menos un producto al carrito");
      return;
    }
    if (!metodoPagoId) {
      toast.error("Seleccione un método de pago");
      return;
    }
    if (esEfectivo && montoInsuficiente) {
      toast.error("El monto recibido es menor al total a pagar");
      return;
    }
    const metodo = metodosPago.find((m) => m.metodoPagoId === metodoPagoId);
    addFactura({
      usuarioId: user!.usuarioId,
      usuarioNombre: `${user!.nombre} ${user!.apellido}`,
      metodoPagoId,
      metodoPagoNombre: metodo?.nombreMetodoPago,
      fechaFactura: new Date().toISOString(),
      subtotal,
      descuentoTotal: totalDesc,
      totalFactura: total,
      nombreCliente: nombreCliente || undefined,
      observaciones: observaciones || undefined,
      detalles: carrito.map(({ stockDisponible: _, ...rest }) => rest),
    });
    toast.success("Venta confirmada exitosamente");
    setNewOpen(false);
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">Ventas</h2>
        <p className="text-sm text-muted-foreground">
          Registro y consulta de ventas e historial de facturas
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por factura, cliente o método..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={openNew} size="sm" className="shrink-0">
          <Plus className="size-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Facturas table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">N° Factura</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Fecha</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Cliente</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Método de Pago</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Cajero</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">Total</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron facturas con ese criterio." : "No hay ventas registradas."}
                </TableCell>
              </TableRow>
            ) : (
              filteredFacturas.map((f) => (
                <TableRow key={f.facturaId} className="group">
                  <TableCell className="font-medium text-sm">{f.numeroFactura}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(f.fechaFactura), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {f.nombreCliente ?? <span className="text-muted-foreground">General</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{f.metodoPagoNombre}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.usuarioNombre}</TableCell>
                  <TableCell className="text-right font-semibold text-sm">{formatC(f.totalFactura)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => { setViewFactura(f); setViewOpen(true); }}
                    >
                      <Eye className="size-3.5" />
                      <span className="sr-only">Ver factura</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredFacturas.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/20">
            {filteredFacturas.length}{" "}
            {filteredFacturas.length === 1 ? "factura" : "facturas"}
            {search && ` encontradas`}
          </div>
        )}
      </div>

      {/* View Factura dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Factura — {viewFactura?.numeroFactura}</DialogTitle>
          </DialogHeader>
          {viewFactura && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Fecha</p>
                  <p className="font-medium">
                    {format(new Date(viewFactura.fechaFactura), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Método de Pago</p>
                  <p className="font-medium">{viewFactura.metodoPagoNombre}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cliente</p>
                  <p className="font-medium">{viewFactura.nombreCliente ?? "Cliente general"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cajero</p>
                  <p className="font-medium">{viewFactura.usuarioNombre}</p>
                </div>
                {viewFactura.observaciones && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Observaciones</p>
                    <p className="font-medium">{viewFactura.observaciones}</p>
                  </div>
                )}
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
                  {(viewFactura.detalles ?? []).map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{d.productoNombre}</TableCell>
                      <TableCell className="text-right text-sm">{d.cantidad}</TableCell>
                      <TableCell className="text-right text-sm">{formatC(d.precioUnitarioVenta)}</TableCell>
                      <TableCell className="text-right text-sm">
                        {d.descuentoLinea > 0 ? formatC(d.descuentoLinea) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatC(d.totalLinea)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex gap-8">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatC(viewFactura.subtotal)}</span>
                </div>
                {viewFactura.descuentoTotal > 0 && (
                  <div className="flex gap-8">
                    <span className="text-muted-foreground">Descuento:</span>
                    <span className="text-destructive">-{formatC(viewFactura.descuentoTotal)}</span>
                  </div>
                )}
                <Separator className="w-48 my-1" />
                <div className="flex gap-8 font-bold text-base">
                  <span>Total:</span>
                  <span>{formatC(viewFactura.totalFactura)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* POS / Nueva Venta dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              Nueva Venta
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Left: product browser */}
            <div className="flex-1 flex flex-col gap-3 p-4 border-r overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto por nombre o concentración..."
                  className="pl-9"
                  value={productoSearch}
                  onChange={(e) => setProductoSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {productosFiltrados.map((p) => (
                  <button
                    key={p.productoId}
                    onClick={() => agregarAlCarrito(p.productoId)}
                    className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-left hover:bg-accent hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="text-sm font-medium truncate text-foreground">
                      {p.nombreGenerico}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.nombreComercial} — {p.concentracionDescripcion}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-primary">
                        {formatC(p.precioVenta)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Stock: {p.stock}
                      </Badge>
                    </div>
                  </button>
                ))}
                {productosFiltrados.length === 0 && (
                  <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                    No hay productos disponibles con ese término.
                  </div>
                )}
              </div>
            </div>

            {/* Right: carrito + resumen */}
            <div className="w-80 flex flex-col overflow-y-auto">
              {/* Carrito items */}
              <div className="flex flex-col gap-2 p-4 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Carrito ({carrito.length})
                </p>
                {carrito.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    Seleccione productos del catálogo
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div
                      key={item.productoId}
                      className="rounded-lg border bg-card p-2.5 flex flex-col gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium leading-tight flex-1">{item.productoNombre}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => quitarDelCarrito(item.productoId)}
                        >
                          <Trash2 className="size-3" />
                          <span className="sr-only">Quitar</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6"
                          onClick={() => cambiarCantidad(item.productoId, -1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6"
                          onClick={() => cambiarCantidad(item.productoId, 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {formatC(item.precioUnitarioVenta)} c/u
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs whitespace-nowrap">Desc. C$</Label>
                        <Input
                          type="number"
                          min={0}
                          max={item.subtotalLinea}
                          step="0.01"
                          className="h-6 text-xs"
                          value={item.descuentoLinea}
                          onChange={(e) =>
                            cambiarDescuentoLinea(item.productoId, Number(e.target.value))
                          }
                        />
                        <span className="text-xs font-semibold text-primary ml-auto whitespace-nowrap">
                          {formatC(item.totalLinea)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              {/* Sale metadata */}
              <div className="flex flex-col gap-2 p-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Cliente (opcional)</Label>
                  <Input
                    className="h-8 text-sm"
                    placeholder="Nombre del cliente"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Descuento Global (C$)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-8 text-sm"
                    value={descuentoGlobal}
                    onChange={(e) => setDescuentoGlobal(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">
                    Método de Pago <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={metodoPagoId > 0 ? String(metodoPagoId) : ""}
                    onValueChange={(v) => {
                      setMetodoPagoId(Number(v));
                      setMontoRecibido("");
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {metodosPago.filter((m) => m.estadoActivo).map((m) => (
                        <SelectItem key={m.metodoPagoId} value={String(m.metodoPagoId)}>
                          {m.nombreMetodoPago}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monto recibido — solo efectivo */}
                {esEfectivo && (
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Banknote className="size-3.5 text-primary" />
                      Monto Recibido (C$) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="h-8 text-sm"
                      placeholder="0.00"
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(e.target.value)}
                    />
                    {montoInsuficiente && (
                      <p className="text-xs text-destructive">
                        El monto recibido es insuficiente
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Observaciones</Label>
                  <Textarea
                    className="text-sm"
                    rows={2}
                    placeholder="Notas opcionales..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="p-4 pt-0">
                <Card className="bg-muted/30">
                  <CardContent className="py-3 flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatC(subtotal)}</span>
                    </div>
                    {totalDesc > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Descuento:</span>
                        <span className="text-destructive">-{formatC(totalDesc)}</span>
                      </div>
                    )}
                    <Separator className="my-0.5" />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total a pagar:</span>
                      <span className="text-primary">{formatC(total)}</span>
                    </div>
                    {/* Cambio — solo efectivo */}
                    {esEfectivo && montoRecibidoNum > 0 && !montoInsuficiente && (
                      <>
                        <Separator className="my-0.5" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-muted-foreground">Monto recibido:</span>
                          <span>{formatC(montoRecibidoNum)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-success">
                          <span>Cambio:</span>
                          <span>{formatC(cambio)}</span>
                        </div>
                      </>
                    )}
                    {esEfectivo && montoInsuficiente && montoRecibidoNum > 0 && (
                      <Alert variant="destructive" className="py-2 px-3 mt-1">
                        <AlertDescription className="text-xs">
                          Faltan {formatC(total - montoRecibidoNum)} para completar el pago
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Button
                  className="w-full mt-3"
                  disabled={
                    carrito.length === 0 ||
                    !metodoPagoId ||
                    (esEfectivo && montoInsuficiente)
                  }
                  onClick={confirmarVenta}
                >
                  <Receipt className="size-4" />
                  Confirmar Venta
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
