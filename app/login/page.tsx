"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Eye, EyeOff, Lock, User, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between bg-sidebar p-10 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <Cross className="size-5 text-sidebar-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-base font-bold text-sidebar-foreground leading-tight">Farma-Di</p>
            <p className="text-xs text-sidebar-foreground/50 leading-tight">Sistema Farmacéutico</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sidebar-accent">
            <Cross className="size-7 text-sidebar-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-sidebar-foreground leading-snug text-balance">
            Gestión farmacéutica profesional para Farmacia Génesis
          </h2>
          <p className="text-sm text-sidebar-foreground/60 leading-relaxed">
            Control de inventario, ventas, compras y catálogos — todo en un solo lugar.
          </p>
        </div>

        {/* Footer info */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-sidebar-foreground/40">Farmacia Génesis · Jinotepe, Nicaragua</p>
          <p className="text-xs text-sidebar-foreground/30">© {new Date().getFullYear()} Farma-Di</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <Cross className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">Farma-Di</p>
            <p className="text-xs text-muted-foreground leading-tight">Farmacia Génesis</p>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6">
          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Iniciar Sesión</h1>
            <p className="text-sm text-muted-foreground">
              Ingrese sus credenciales para acceder al sistema
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombreUsuario">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="nombreUsuario"
                  placeholder="Nombre de usuario"
                  className="pl-9 h-10"
                  aria-invalid={!!errors.nombreUsuario}
                  autoComplete="username"
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
                  className="pl-9 pr-10 h-10"
                  aria-invalid={!!errors.contrasena}
                  autoComplete="current-password"
                  {...register("contrasena")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-destructive">{errors.contrasena.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-1"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Verificando..." : "Ingresar al sistema"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Credenciales de demostración</p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Administrador:</span>
                <span className="font-mono">admin / admin123</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Vendedor:</span>
                <span className="font-mono">vendedor / vendedor123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Farmacia Génesis · Jinotepe, Nicaragua
        </p>
      </div>
    </div>
  );
}
