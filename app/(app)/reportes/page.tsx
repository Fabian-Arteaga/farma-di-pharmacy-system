"use client";

import { useMemo } from "react";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function formatC(n: number) {
  return `C$ ${n.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;
}

export default function ReportesPage() {
  const { compras, facturas, inventario, productos, proveedores } = useStore();

  // ---- Proveedor con más compras ----
  const comprasPorProveedor = useMemo(() => {
    const map: Record<string, { nombre: string; total: number; cantidad: number }> = {};
    compras.forEach((c) => {
      const key = String(c.proveedorId);
      if (!map[key]) map[key] = { nombre: c.proveedorNombre ?? "Desconocido", total: 0, cantidad: 0 };
      map[key].total += c.totalCompra;
      map[key].cantidad += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [compras]);

  // ---- Productos más vendidos ----
  const productosMasVendidos = useMemo(() => {
    const map: Record<number, { nombre: string; vendidos: number; ganancia: number }> = {};
    facturas.forEach((f) => {
      (f.detalles ?? []).forEach((d) => {
        if (!map[d.productoId]) {
          const inv = inventario.find((i) => i.productoId === d.productoId);
          map[d.productoId] = { nombre: d.productoNombre ?? "Producto", vendidos: 0, ganancia: 0 };
        }
        map[d.productoId].vendidos += d.cantidad;
        const inv = inventario.find((i) => i.productoId === d.productoId);
        const ganancia = (d.precioUnitarioVenta - (inv?.precioCompra ?? 0)) * d.cantidad;
        map[d.productoId].ganancia += ganancia;
      });
    });
    return Object.values(map).sort((a, b) => b.vendidos - a.vendidos);
  }, [facturas, inventario]);

  // ---- Marca más vendida ----
  const marcasMasVendidas = useMemo(() => {
    const map: Record<string, { marca: string; vendidos: number }> = {};
    facturas.forEach((f) => {
      (f.detalles ?? []).forEach((d) => {
        const prod = productos.find((p) => p.productoId === d.productoId);
        const marca = prod?.marcaNombre ?? "Sin marca";
        if (!map[marca]) map[marca] = { marca, vendidos: 0 };
        map[marca].vendidos += d.cantidad;
      });
    });
    return Object.values(map).sort((a, b) => b.vendidos - a.vendidos);
  }, [facturas, productos]);

  // ---- Hora pico de ventas (from facturas) ----
  const horasPico = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 6; h <= 21; h++) map[h] = 0;
    facturas.forEach((f) => {
      const h = new Date(f.fechaFactura).getHours();
      map[h] = (map[h] ?? 0) + 1;
    });
    return Object.entries(map).map(([hora, ventas]) => ({ hora: `${hora}:00`, ventas })).sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
  }, [facturas]);

  // ---- Ventas por categoría ----
  const ventasPorCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    facturas.forEach((f) => {
      (f.detalles ?? []).forEach((d) => {
        const prod = productos.find((p) => p.productoId === d.productoId);
        const cat = prod?.categoriaNombre ?? "Sin categoría";
        map[cat] = (map[cat] ?? 0) + d.totalLinea;
      });
    });
    return Object.entries(map).map(([categoria, total]) => ({ categoria, total })).sort((a, b) => b.total - a.total);
  }, [facturas, productos]);

  // ---- Próximos a vencer (30 días) ----
  const hoy = new Date();
  const limite = addDays(hoy, 30);
  const proxVencer = useMemo(() =>
    inventario
      .filter((i) => i.fechaVencimiento && isBefore(new Date(i.fechaVencimiento), limite) && isAfter(new Date(i.fechaVencimiento), hoy))
      .sort((a, b) => new Date(a.fechaVencimiento!).getTime() - new Date(b.fechaVencimiento!).getTime()),
    [inventario]
  );

  // ---- Mejor y peor producto por ganancia ----
  const sorted = [...productosMasVendidos].sort((a, b) => b.ganancia - a.ganancia);
  const mejorGanancia = sorted[0];
  const peorGanancia = sorted[sorted.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Reportes y Análisis</h2>
        <p className="text-sm text-muted-foreground">Información analítica para la toma de decisiones gerenciales</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Ventas</p>
            <p className="text-xl font-bold text-chart-1">{formatC(facturas.reduce((s, f) => s + f.totalFactura, 0))}</p>
            <p className="text-xs text-muted-foreground mt-1">{facturas.length} facturas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Compras</p>
            <p className="text-xl font-bold text-chart-2">{formatC(compras.reduce((s, c) => s + c.totalCompra, 0))}</p>
            <p className="text-xs text-muted-foreground mt-1">{compras.length} órdenes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Ganancia Estimada</p>
            <p className="text-xl font-bold text-chart-3">
              {formatC(productosMasVendidos.reduce((s, p) => s + p.ganancia, 0))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Margen bruto</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Próx. a Vencer</p>
            <p className="text-xl font-bold text-chart-4">{proxVencer.length}</p>
            <p className="text-xs text-muted-foreground mt-1">en 30 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Proveedores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Compras por Proveedor</CardTitle>
            <CardDescription>Proveedor al que más se le ha comprado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comprasPorProveedor} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip formatter={(v: number) => [formatC(v), "Total comprado"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="total" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por categoría */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas por Categoría</CardTitle>
            <CardDescription>Distribución de ingresos por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ventasPorCategoria} cx="50%" cy="45%" innerRadius={45} outerRadius={70} dataKey="total" nameKey="categoria" paddingAngle={3}>
                  {ventasPorCategoria.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatC(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Hora pico */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hora de Mayor Venta</CardTitle>
            <CardDescription>Cantidad de ventas por hora del día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={horasPico} margin={{ top: 4, right: 4, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="ventas" name="Ventas" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marcas más vendidas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Marca Más Vendida</CardTitle>
            <CardDescription>Unidades vendidas por marca de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mt-1">
              {marcasMasVendidas.slice(0, 6).map((m, i) => (
                <div key={m.marca} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{m.marca}</span>
                      <span className="text-muted-foreground">{m.vendidos} uds.</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(m.vendidos / (marcasMasVendidas[0]?.vendidos ?? 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Best/worst + top products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Mejor ganancia */}
        <Card className="border-chart-2/30 bg-chart-2/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-chart-2">Producto Más Rentable</CardTitle>
          </CardHeader>
          <CardContent>
            {mejorGanancia ? (
              <div className="flex flex-col gap-1">
                <p className="font-bold text-foreground">{mejorGanancia.nombre}</p>
                <p className="text-2xl font-bold text-chart-2">{formatC(mejorGanancia.ganancia)}</p>
                <p className="text-xs text-muted-foreground">{mejorGanancia.vendidos} unidades vendidas</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">Sin datos</p>}
          </CardContent>
        </Card>

        {/* Peor ganancia */}
        <Card className="border-chart-4/30 bg-chart-4/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-chart-4">Producto Menos Rentable</CardTitle>
          </CardHeader>
          <CardContent>
            {peorGanancia && peorGanancia !== mejorGanancia ? (
              <div className="flex flex-col gap-1">
                <p className="font-bold text-foreground">{peorGanancia.nombre}</p>
                <p className="text-2xl font-bold text-chart-4">{formatC(peorGanancia.ganancia)}</p>
                <p className="text-xs text-muted-foreground">{peorGanancia.vendidos} unidades vendidas</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">Sin datos suficientes</p>}
          </CardContent>
        </Card>

        {/* Próximos a vencer */}
        <Card className="border-chart-4/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Próximos a Vencer</CardTitle>
            <CardDescription className="text-xs">Productos con vencimiento en 30 días ({proxVencer.length})</CardDescription>
          </CardHeader>
          <CardContent>
            {proxVencer.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ningún producto próximo a vencer.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {proxVencer.slice(0, 5).map((item) => (
                  <div key={item.productoId} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{item.nombreComercial}</p>
                      <p className="text-xs text-muted-foreground">{item.concentracion}</p>
                    </div>
                    <Badge variant="outline" className="text-xs text-chart-4 border-chart-4/50 shrink-0">
                      {format(new Date(item.fechaVencimiento!), "dd/MM/yy")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Productos más vendidos tabla */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ranking de Productos Más Vendidos</CardTitle>
          <CardDescription>Ordenados por unidades vendidas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase">#</TableHead>
                <TableHead className="text-xs font-semibold uppercase">Producto</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-right">Unidades</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-right">Ganancia Bruta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosMasVendidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No hay datos de ventas disponibles.
                  </TableCell>
                </TableRow>
              ) : (
                productosMasVendidos.map((p, i) => (
                  <TableRow key={p.nombre}>
                    <TableCell className="text-sm font-bold text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="text-sm font-medium">{p.nombre}</TableCell>
                    <TableCell className="text-right text-sm">{p.vendidos}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-chart-2">{formatC(p.ganancia)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
