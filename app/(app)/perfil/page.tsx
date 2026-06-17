"use client";

import { User, Mail, Phone, Shield, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store";

export default function PerfilPage() {
  const { user } = useAuth();
  const { usuarios } = useStore();

  const usuarioCompleto = usuarios.find((u) => u.usuarioId === user?.usuarioId);
  const initials = user ? `${user.nombre[0]}${user.apellido[0]}` : "U";

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold">Mi Perfil</h2>
        <p className="text-sm text-muted-foreground">Información de la cuenta del usuario actual</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="size-16">
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">{user?.nombre} {user?.apellido}</h3>
              <p className="text-sm text-muted-foreground">@{user?.nombreUsuario}</p>
              <div className="flex gap-2 mt-1">
                {user?.roles.map((rol) => (
                  <Badge key={rol} variant="secondary" className="text-xs">
                    <Shield className="size-3 mr-1" />
                    {rol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Información de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nombre completo</p>
              <p className="text-sm font-medium">{user?.nombre} {user?.apellido}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Mail className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Correo electrónico</p>
              <p className="text-sm font-medium">{user?.correoElectronico}</p>
            </div>
          </div>
          {usuarioCompleto?.telefono && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <Phone className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium">{usuarioCompleto.telefono}</p>
                </div>
              </div>
            </>
          )}
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Shield className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rol asignado</p>
              <p className="text-sm font-medium">{user?.roles.join(", ")}</p>
            </div>
          </div>
          {usuarioCompleto?.fechaCreacion && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Miembro desde</p>
                  <p className="text-sm font-medium">
                    {new Date(usuarioCompleto.fechaCreacion).toLocaleDateString("es-NI", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center">
            Para cambiar sus credenciales o modificar información de perfil, contacte al administrador del sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
