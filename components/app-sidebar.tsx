"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Receipt, Package, BarChart3,
  BookOpen, Pill, LogOut, ChevronRight, AlertTriangle,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth, useIsAdmin } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

const catalogosItems = [
  { label: "Usuarios", href: "/catalogos/usuarios", adminOnly: true },
  { label: "Roles", href: "/catalogos/roles", adminOnly: true },
  { label: "Marcas", href: "/catalogos/marcas", adminOnly: true },
  { label: "Categorías", href: "/catalogos/categorias", adminOnly: true },
  { label: "Presentaciones", href: "/catalogos/presentaciones", adminOnly: true },
  { label: "Concentraciones", href: "/catalogos/concentraciones", adminOnly: true },
  { label: "Proveedores", href: "/catalogos/proveedores", adminOnly: true },
  { label: "Métodos de Pago", href: "/catalogos/metodos-pago", adminOnly: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isAdmin = useIsAdmin();
  const { inventario } = useStore();

  const alertas = inventario.filter(i => i.estado !== 'normal').length;
  const visibleCatalogos = catalogosItems.filter(i => !i.adminOnly || isAdmin);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Pill className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground leading-tight">Farma-Di</span>
            <span className="text-xs text-sidebar-foreground/60 leading-tight">Farmacia Génesis</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/ventas")}>
                <Link href="/ventas">
                  <Receipt />
                  <span>Ventas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/compras")}>
                  <Link href="/compras">
                    <ShoppingCart />
                    <span>Compras</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/productos")}>
                <Link href="/productos">
                  <Package />
                  <span>Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/inventario")}>
                <Link href="/inventario">
                  <div className="flex items-center gap-2 flex-1">
                    <AlertTriangle className={cn("size-4", alertas > 0 && "text-warning")} />
                    <span>Inventario</span>
                  </div>
                  {alertas > 0 && (
                    <Badge variant="outline" className="ml-auto text-xs border-warning text-warning">
                      {alertas}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reportes")}>
                  <Link href="/reportes">
                    <BarChart3 />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {visibleCatalogos.length > 0 && (
              <Collapsible defaultOpen={pathname.startsWith("/catalogos")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isActive("/catalogos")}>
                      <BookOpen />
                      <span>Catálogos</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {visibleCatalogos.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                            <Link href={item.href}>{item.label}</Link>
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
        <div className="px-2 pt-1 pb-0">
          <p className="text-xs text-sidebar-foreground/60 truncate">
            {user?.nombre} {user?.apellido} · {user?.roles[0]}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
