"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ventas": "Ventas",
  "/compras": "Compras",
  "/productos": "Productos",
  "/inventario": "Inventario",
  "/reportes": "Reportes",
  "/catalogos": "Catálogos",
  "/catalogos/usuarios": "Usuarios",
  "/catalogos/roles": "Roles",
  "/catalogos/marcas": "Marcas",
  "/catalogos/categorias": "Categorías",
  "/catalogos/presentaciones": "Presentaciones",
  "/catalogos/concentraciones": "Concentraciones",
  "/catalogos/proveedores": "Proveedores",
  "/catalogos/metodos-pago": "Métodos de Pago",
  "/perfil": "Mi Perfil",
};

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const label = ROUTE_LABELS[pathname] ?? "Farma-Di";
  const initials = user ? `${user.nombre[0]}${user.apellido[0]}` : "U";

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Page label */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">{label}</h1>
      </div>

      {/* Right side — user menu */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-8 px-2"
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium leading-tight">
                  {user?.nombre} {user?.apellido}
                </span>
                <Badge
                  variant="secondary"
                  className="hidden md:inline-flex text-[10px] h-4 px-1.5"
                >
                  {user?.roles[0]}
                </Badge>
                <ChevronDown className="size-3 text-muted-foreground shrink-0" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">
                  {user?.nombre} {user?.apellido}
                </span>
                <span className="text-xs text-muted-foreground">{user?.correoElectronico}</span>
                <span className="text-xs text-muted-foreground">{user?.roles[0]}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/perfil" />}>
              <User className="size-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
