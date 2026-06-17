"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Pill, Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

const schema = z.object({
  nombreUsuario: z.string().min(1, "El usuario es requerido"),
  contrasena: z.string().min(1, "La contraseña es requerida"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");
    const result = await login(data.nombreUsuario, data.contrasena);
    if (result.success) {
      router.replace("/dashboard");
    } else {
      setErrorMsg(result.message ?? "Error de autenticación");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Pill className="size-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Farma-Di</h1>
            <p className="text-sm text-muted-foreground mt-1">Farmacia Génesis — Jinotepe</p>
          </div>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {errorMsg && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombreUsuario">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="nombreUsuario"
                    placeholder="Nombre de usuario"
                    className="pl-9"
                    aria-invalid={!!errors.nombreUsuario}
                    {...register("nombreUsuario")}
                  />
                </div>
                {errors.nombreUsuario && (
                  <p className="text-xs text-destructive">{errors.nombreUsuario.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contrasena">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="contrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="pl-9 pr-9"
                    aria-invalid={!!errors.contrasena}
                    {...register("contrasena")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.contrasena && (
                  <p className="text-xs text-destructive">{errors.contrasena.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? "Verificando..." : "Iniciar Sesión"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <p className="font-semibold mb-1 text-foreground">Credenciales de demostración:</p>
              <p><span className="font-medium">Admin:</span> admin / admin123</p>
              <p><span className="font-medium">Vendedor:</span> vendedor / vendedor123</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Farmacia Génesis · Jinotepe, Nicaragua
        </p>
      </div>
    </div>
  );
}
