"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Receipt, Package, BarChart3,
  BookOpen, Cross, LogOut, ChevronRight, AlertTriangle,
  Users, ShieldCheck, Tag, Layers, FlaskConical, Truck, CreditCard,
  Pill,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth, useIsAdmin } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

const catalogosItems = [
  { label: "Usuarios", href: "/catalogos/usuarios", icon: Users, adminOnly: true },
  { label: "Roles", href: "/catalogos/roles", icon: ShieldCheck, adminOnly: true },
  { label: "Marcas", href: "/catalogos/marcas", icon: Tag, adminOnly: true },
  { label: "Categorías", href: "/catalogos/categorias", icon: Layers, adminOnly: true },
  { label: "Presentaciones", href: "/catalogos/presentaciones", icon: Pill, adminOnly: true },
  { label: "Concentraciones", href: "/catalogos/concentraciones", icon: FlaskConical, adminOnly: true },
  { label: "Proveedores", href: "/catalogos/proveedores", icon: Truck, adminOnly: true },
  { label: "Métodos de Pago", href: "/catalogos/metodos-pago", icon: CreditCard, adminOnly: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isAdmin = useIsAdmin();
  const { inventario } = useStore();

  const alertas = inventario.filter((i) => i.estado !== "normal").length;
  const visibleCatalogos = catalogosItems.filter((i) => !i.adminOnly || isAdmin);
  const [catalogosOpen, setCatalogosOpen] = useState(() => pathname.startsWith("/catalogos"));

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary shrink-0">
            <Cross className="size-4 text-sidebar-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-sidebar-foreground leading-tight truncate">
              Farma-Di
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 leading-tight truncate">
              Farmacia Génesis
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("/dashboard")}
                render={<Link href="/dashboard" />}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Ventas */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("/ventas")}
                render={<Link href="/ventas" />}
                tooltip="Ventas"
              >
                <Receipt />
                <span>Ventas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Compras — admin only */}
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/compras")}
                  render={<Link href="/compras" />}
                  tooltip="Compras"
                >
                  <ShoppingCart />
                  <span>Compras</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Productos */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("/productos")}
                render={<Link href="/productos" />}
                tooltip="Productos"
              >
                <Package />
                <span>Productos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Inventario */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("/inventario")}
                render={<Link href="/inventario" />}
                tooltip="Inventario"
              >
                <AlertTriangle
                  className={cn(alertas > 0 && "text-yellow-400")}
                />
                <span>Inventario</span>
                {alertas > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-auto shrink-0 text-[10px] h-4 px-1.5 border-yellow-400/60 text-yellow-400 bg-yellow-400/10"
                  >
                    {alertas}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Reportes — admin only */}
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/reportes")}
                  render={<Link href="/reportes" />}
                  tooltip="Reportes"
                >
                  <BarChart3 />
                  <span>Reportes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Catálogos — collapsible, admin only */}
            {visibleCatalogos.length > 0 && (
              <Collapsible open={catalogosOpen} onOpenChange={setCatalogosOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton isActive={isActive("/catalogos")}>
                        <BookOpen />
                        <span>Catálogos</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    }
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {visibleCatalogos.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            isActive={pathname === item.href}
                            render={<Link href={item.href} />}
                          >
                            <item.icon className="size-3.5" />
                            {item.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <span className="text-[10px] font-bold text-sidebar-accent-foreground uppercase">
              {user?.nombre?.[0]}{user?.apellido?.[0]}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate leading-tight">
              {user?.roles[0]}
            </p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
