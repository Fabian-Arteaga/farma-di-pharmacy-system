"use client";

import { TrendingUp, ShoppingCart, Package, AlertTriangle, DollarSign, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { mockKpi, ventasMensuales, ventasPorCategoria, ventasPorHora, topProductos } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function formatCurrency(n: number) {
  return `C$ ${n.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;
}

const kpiCards = (kpi: typeof mockKpi, alertas: number, totalProductos: number) => [
  { label: "Ventas del Mes", value: formatCurrency(kpi.ventasMes), icon: Receipt, color: "text-chart-1", bg: "bg-chart-1/10", change: "+8.2%" },
  { label: "Compras del Mes", value: formatCurrency(kpi.comprasMes), icon: ShoppingCart, color: "text-chart-2", bg: "bg-chart-2/10", change: "+3.5%" },
  { label: "Ganancia del Mes", value: formatCurrency(kpi.gananciaMes), icon: DollarSign, color: "text-chart-3", bg: "bg-chart-3/10", change: "+12.1%" },
  { label: "Alertas de Inventario", value: `${alertas}`, icon: AlertTriangle, color: "text-chart-4", bg: "bg-chart-4/10", suffix: "productos" },
  { label: "Productos Activos", value: `${totalProductos}`, icon: Package, color: "text-primary", bg: "bg-primary/10", suffix: "en catálogo" },
  { label: "Ventas de Hoy", value: formatCurrency(kpi.ventasHoy), icon: TrendingUp, color: "text-chart-5", bg: "bg-chart-5/10", change: "+5.4%" },
];

export default function DashboardPage() {
  const { inventario, facturas, compras } = useStore();
  const { user } = useAuth();
  const alertas = inventario.filter((i) => i.estado !== "normal").length;
  const totalProductos = inventario.length;

  const cards = kpiCards(mockKpi, alertas, totalProductos);
  const ultimasVentas = [...facturas].sort((a, b) => new Date(b.fechaFactura).getTime() - new Date(a.fechaFactura).getTime()).slice(0, 5);
  const ultimasCompras = [...compras].sort((a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Bienvenido, {user?.nombre}
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{card.value}</p>
                  {card.change && (
                    <p className="text-xs text-chart-2 font-medium">{card.change} este mes</p>
                  )}
                  {card.suffix && (
                    <p className="text-xs text-muted-foreground">{card.suffix}</p>
                  )}
                </div>
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Ventas vs Compras */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas vs Compras Mensuales</CardTitle>
            <CardDescription>Comparativo de los últimos 6 meses (C$)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ventasMensuales} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`C$ ${value.toLocaleString()}`, ""]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="ventas" name="Ventas" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compras" name="Compras" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por Categoría */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas por Categoría</CardTitle>
            <CardDescription>Distribución del mes actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ventasPorCategoria} cx="50%" cy="45%" innerRadius={50} outerRadius={75} dataKey="total" nameKey="categoria" paddingAngle={3}>
                  {ventasPorCategoria.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `C$ ${v.toLocaleString()}`} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pico de Ventas por Hora */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hora de Mayor Venta</CardTitle>
            <CardDescription>Número de transacciones por hora del día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={ventasPorHora} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Line type="monotone" dataKey="ventas" name="Ventas" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Productos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Productos Más Vendidos</CardTitle>
            <CardDescription>Por unidades este mes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {topProductos.map((p, i) => (
              <div key={p.nombre} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-foreground">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">{p.vendidos} uds.</p>
                </div>
                <span className="text-xs font-semibold text-chart-2 shrink-0">C$ {p.ganancia.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimas Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {ultimasVentas.map((f) => (
                <div key={f.facturaId} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-1/10">
                    <Receipt className="size-4 text-chart-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.numeroFactura}</p>
                    <p className="text-xs text-muted-foreground">{f.nombreCliente ?? "Cliente general"} · {f.metodoPagoNombre}</p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">C$ {f.totalFactura.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimas Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {ultimasCompras.map((c) => (
                <div key={c.compraId} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
                    <ShoppingCart className="size-4 text-chart-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.numeroCompra}</p>
                    <p className="text-xs text-muted-foreground">{c.proveedorNombre}</p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">C$ {c.totalCompra.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Inventario */}
      {alertas > 0 && (
        <Card className="border-chart-4/40 bg-chart-4/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-chart-4" />
              <CardTitle className="text-base text-chart-4">Alertas de Inventario</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {inventario.filter((i) => i.estado !== "normal").map((item) => (
                <div key={item.productoId} className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{item.nombreComercial} — {item.concentracion}</p>
                  <Badge variant={item.estado === "agotado" ? "destructive" : "outline"} className={item.estado === "critico" ? "border-chart-4 text-chart-4" : ""}>
                    {item.estado === "agotado" ? "Agotado" : `Stock crítico: ${item.cantidadDisponible}`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
