"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-sm font-semibold text-foreground truncate">{label}</h1>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user?.nombre} {user?.apellido}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{user?.nombre} {user?.apellido}</span>
                <span className="text-xs text-muted-foreground">{user?.correoElectronico}</span>
                <span className="text-xs text-muted-foreground">{user?.roles[0]}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil">
                <User data-icon="inline-start" />
                Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
