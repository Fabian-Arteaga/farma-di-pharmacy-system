"use client";

import { useState, useMemo } from "react";
import { format, isBefore, addDays } from "date-fns";
import { AlertTriangle, Search, Package, PackageX, PackageCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function formatC(n: number) {
  return `C$ ${n.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;
}

type EstadoFiltro = "todos" | "normal" | "critico" | "agotado";

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "agotado")
    return (
      <Badge variant="destructive" className="text-xs gap-1">
        <PackageX className="size-3" />
        Agotado
      </Badge>
    );
  if (estado === "critico")
    return (
      <Badge
        variant="outline"
        className="text-xs gap-1 text-chart-4 border-chart-4/50 bg-chart-4/10"
      >
        <AlertTriangle className="size-3" />
        Stock crítico
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="text-xs gap-1 text-chart-2 border-chart-2/40 bg-chart-2/10"
    >
      <PackageCheck className="size-3" />
      Normal
    </Badge>
  );
}

export default function InventarioPage() {
  const { inventario } = useStore();
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");

  const hoy = new Date();
  const limite30 = addDays(hoy, 30);

  const filtered = useMemo(() =>
    inventario.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.nombreGenerico.toLowerCase().includes(search.toLowerCase()) ||
        item.nombreComercial.toLowerCase().includes(search.toLowerCase()) ||
        item.marca.toLowerCase().includes(search.toLowerCase()) ||
        item.presentacion.toLowerCase().includes(search.toLowerCase()) ||
        item.proveedor.toLowerCase().includes(search.toLowerCase());
      const matchEstado = estadoFiltro === "todos" || item.estado === estadoFiltro;
      return matchSearch && matchEstado;
    }),
    [inventario, search, estadoFiltro]
  );

  const stats = useMemo(() => ({
    total: inventario.length,
    criticos: inventario.filter((i) => i.estado === "critico").length,
    agotados: inventario.filter((i) => i.estado === "agotado").length,
    normales: inventario.filter((i) => i.estado === "normal").length,
    proxVencer: inventario.filter(
      (i) => i.fechaVencimiento && isBefore(new Date(i.fechaVencimiento), limite30)
    ).length,
  }), [inventario]);

  const kpis = [
    {
      label: "Total Productos",
      value: stats.total,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      icon: Package,
    },
    {
      label: "Estado Normal",
      value: stats.normales,
      colorClass: "text-chart-2",
      bgClass: "bg-chart-2/10",
      icon: PackageCheck,
    },
    {
      label: "Stock Crítico",
      value: stats.criticos,
      colorClass: "text-chart-4",
      bgClass: "bg-chart-4/10",
      icon: AlertTriangle,
    },
    {
      label: "Agotados",
      value: stats.agotados,
      colorClass: "text-destructive",
      bgClass: "bg-destructive/10",
      icon: PackageX,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-foreground">Inventario</h2>
        <p className="text-sm text-muted-foreground">Monitoreo del stock actual de productos</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  s.bgClass
                )}
              >
                <s.icon className={cn("size-5", s.colorClass)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-2xl font-bold", s.colorClass)}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert banner */}
      {(stats.criticos > 0 || stats.agotados > 0) && (
        <div className="flex items-center gap-2.5 rounded-lg border border-chart-4/30 bg-chart-4/5 px-4 py-3">
          <AlertTriangle className="size-4 text-chart-4 shrink-0" />
          <p className="text-sm text-chart-4 font-medium">
            {stats.agotados > 0 &&
              `${stats.agotados} producto${stats.agotados > 1 ? "s" : ""} agotado${stats.agotados > 1 ? "s" : ""}`}
            {stats.agotados > 0 && stats.criticos > 0 && " · "}
            {stats.criticos > 0 &&
              `${stats.criticos} producto${stats.criticos > 1 ? "s" : ""} con stock crítico`}
            {stats.proxVencer > 0 &&
              ` · ${stats.proxVencer} próximo${stats.proxVencer > 1 ? "s" : ""} a vencer`}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, marca, presentación..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={estadoFiltro}
          onValueChange={(v) => setEstadoFiltro(v as EstadoFiltro)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="critico">Stock crítico</SelectItem>
            <SelectItem value="agotado">Agotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Producto</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Presentación</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Concentración</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Marca</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Disponible
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Stock Crítico
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                P. Compra
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                P. Venta
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Vencimiento
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No hay productos que coincidan con el filtro.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const proxVencer =
                  item.fechaVencimiento &&
                  isBefore(new Date(item.fechaVencimiento), limite30);

                return (
                  <TableRow
                    key={item.productoId}
                    className={cn(
                      item.estado === "agotado" && "bg-destructive/5",
                      item.estado === "critico" && "bg-chart-4/5"
                    )}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{item.nombreComercial}</p>
                        <p className="text-xs text-muted-foreground">{item.nombreGenerico}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.presentacion}</TableCell>
                    <TableCell className="text-sm">{item.concentracion}</TableCell>
                    <TableCell className="text-sm">{item.marca}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          item.estado === "agotado" && "text-destructive",
                          item.estado === "critico" && "text-chart-4",
                          item.estado === "normal" && "text-foreground"
                        )}
                      >
                        {item.cantidadDisponible}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {item.stockCritico}
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatC(item.precioCompra)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatC(item.precioVenta)}</TableCell>
                    <TableCell>
                      {item.fechaVencimiento ? (
                        <span
                          className={cn(
                            "text-sm",
                            proxVencer ? "text-chart-4 font-semibold" : "text-muted-foreground"
                          )}
                        >
                          {format(new Date(item.fechaVencimiento), "MM/yyyy")}
                          {proxVencer && " ⚠"}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <EstadoBadge estado={item.estado} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/20">
            {filtered.length} de {inventario.length} productos
          </div>
        )}
      </div>
    </div>
  );
}
