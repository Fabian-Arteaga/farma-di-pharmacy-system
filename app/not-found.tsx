import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-8xl font-black text-muted-foreground/20">404</p>
        <h1 className="text-2xl font-bold text-foreground">Página no encontrada</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          La página que busca no existe o ha sido movida.
        </p>
        <Button render={<Link href="/dashboard" />}>Volver al Dashboard</Button>
      </div>
    </div>
  );
}
