"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Rol, Usuario, Marca, Categoria, Presentacion, Concentracion, Proveedor, MetodoPago, Producto, ItemInventario, Compra, Factura } from "./types";
import { mockRoles, mockUsuarios, mockMarcas, mockCategorias, mockPresentaciones, mockConcentraciones, mockProveedores, mockMetodosPago, mockProductos, mockInventario, mockCompras, mockFacturas } from "./mock-data";

type StoreContextType = {
  roles: Rol[];
  usuarios: Usuario[];
  marcas: Marca[];
  categorias: Categoria[];
  presentaciones: Presentacion[];
  concentraciones: Concentracion[];
  proveedores: Proveedor[];
  metodosPago: MetodoPago[];
  productos: Producto[];
  inventario: ItemInventario[];
  compras: Compra[];
  facturas: Factura[];

  // CRUD helpers
  addRol: (r: Omit<Rol, "rolId">) => void;
  updateRol: (r: Rol) => void;
  addUsuario: (u: Omit<Usuario, "usuarioId" | "fechaCreacion">) => void;
  updateUsuario: (u: Usuario) => void;
  addMarca: (m: Omit<Marca, "marcaId">) => void;
  updateMarca: (m: Marca) => void;
  deleteMarca: (id: number) => void;
  addCategoria: (c: Omit<Categoria, "categoriaId">) => void;
  updateCategoria: (c: Categoria) => void;
  deleteCategoria: (id: number) => void;
  addPresentacion: (p: Omit<Presentacion, "presentacionId">) => void;
  updatePresentacion: (p: Presentacion) => void;
  addConcentracion: (c: Omit<Concentracion, "concentracionId">) => void;
  updateConcentracion: (c: Concentracion) => void;
  addProveedor: (p: Omit<Proveedor, "proveedorId">) => void;
  updateProveedor: (p: Proveedor) => void;
  addMetodoPago: (m: Omit<MetodoPago, "metodoPagoId">) => void;
  updateMetodoPago: (m: MetodoPago) => void;
  addProducto: (p: Omit<Producto, "productoId" | "fechaCreacion">) => void;
  updateProducto: (p: Producto) => void;
  deleteProducto: (id: number) => void;
  addCompra: (c: Omit<Compra, "compraId" | "numeroCompra">) => void;
  addFactura: (f: Omit<Factura, "facturaId" | "numeroFactura">) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

function nextId<T extends { [key: string]: number }>(arr: T[], key: keyof T): number {
  return arr.length > 0 ? Math.max(...arr.map((x) => x[key] as number)) + 1 : 1;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<Rol[]>(mockRoles);
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [marcas, setMarcas] = useState<Marca[]>(mockMarcas);
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>(mockPresentaciones);
  const [concentraciones, setConcentraciones] = useState<Concentracion[]>(mockConcentraciones);
  const [proveedores, setProveedores] = useState<Proveedor[]>(mockProveedores);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>(mockMetodosPago);
  const [productos, setProductos] = useState<Producto[]>(mockProductos);
  const [inventario, setInventario] = useState<ItemInventario[]>(mockInventario);
  const [compras, setCompras] = useState<Compra[]>(mockCompras);
  const [facturas, setFacturas] = useState<Factura[]>(mockFacturas);

  // Roles
  const addRol = useCallback((r: Omit<Rol, "rolId">) => setRoles(p => [...p, { ...r, rolId: nextId(p, "rolId") }]), []);
  const updateRol = useCallback((r: Rol) => setRoles(p => p.map(x => x.rolId === r.rolId ? r : x)), []);

  // Usuarios
  const addUsuario = useCallback((u: Omit<Usuario, "usuarioId" | "fechaCreacion">) =>
    setUsuarios(p => [...p, { ...u, usuarioId: nextId(p, "usuarioId"), fechaCreacion: new Date().toISOString() }]), []);
  const updateUsuario = useCallback((u: Usuario) => setUsuarios(p => p.map(x => x.usuarioId === u.usuarioId ? u : x)), []);

  // Marcas
  const addMarca = useCallback((m: Omit<Marca, "marcaId">) => setMarcas(p => [...p, { ...m, marcaId: nextId(p, "marcaId") }]), []);
  const updateMarca = useCallback((m: Marca) => setMarcas(p => p.map(x => x.marcaId === m.marcaId ? m : x)), []);
  const deleteMarca = useCallback((id: number) => setMarcas(p => p.filter(x => x.marcaId !== id)), []);

  // Categorías
  const addCategoria = useCallback((c: Omit<Categoria, "categoriaId">) => setCategorias(p => [...p, { ...c, categoriaId: nextId(p, "categoriaId") }]), []);
  const updateCategoria = useCallback((c: Categoria) => setCategorias(p => p.map(x => x.categoriaId === c.categoriaId ? c : x)), []);
  const deleteCategoria = useCallback((id: number) => setCategorias(p => p.filter(x => x.categoriaId !== id)), []);

  // Presentaciones
  const addPresentacion = useCallback((pr: Omit<Presentacion, "presentacionId">) => setPresentaciones(p => [...p, { ...pr, presentacionId: nextId(p, "presentacionId") }]), []);
  const updatePresentacion = useCallback((pr: Presentacion) => setPresentaciones(p => p.map(x => x.presentacionId === pr.presentacionId ? pr : x)), []);

  // Concentraciones
  const addConcentracion = useCallback((c: Omit<Concentracion, "concentracionId">) => setConcentraciones(p => [...p, { ...c, concentracionId: nextId(p, "concentracionId") }]), []);
  const updateConcentracion = useCallback((c: Concentracion) => setConcentraciones(p => p.map(x => x.concentracionId === c.concentracionId ? c : x)), []);

  // Proveedores
  const addProveedor = useCallback((pr: Omit<Proveedor, "proveedorId">) => setProveedores(p => [...p, { ...pr, proveedorId: nextId(p, "proveedorId") }]), []);
  const updateProveedor = useCallback((pr: Proveedor) => setProveedores(p => p.map(x => x.proveedorId === pr.proveedorId ? pr : x)), []);

  // Métodos de Pago
  const addMetodoPago = useCallback((m: Omit<MetodoPago, "metodoPagoId">) => setMetodosPago(p => [...p, { ...m, metodoPagoId: nextId(p, "metodoPagoId") }]), []);
  const updateMetodoPago = useCallback((m: MetodoPago) => setMetodosPago(p => p.map(x => x.metodoPagoId === m.metodoPagoId ? m : x)), []);

  // Productos
  const addProducto = useCallback((pr: Omit<Producto, "productoId" | "fechaCreacion">) => {
    const cat = categorias.find(c => c.categoriaId === pr.categoriaId);
    const pres = presentaciones.find(p => p.presentacionId === pr.presentacionId);
    const conc = concentraciones.find(c => c.concentracionId === pr.concentracionId);
    const prov = proveedores.find(p => p.proveedorId === pr.proveedorId);
    const marc = marcas.find(m => m.marcaId === pr.marcaId);
    setProductos(p => [...p, {
      ...pr, productoId: nextId(p, "productoId"), fechaCreacion: new Date().toISOString(),
      categoriaNombre: cat?.nombreCategoria, presentacionNombre: pres?.nombrePresentacion,
      concentracionDescripcion: conc ? `${conc.valorConcentracion} ${conc.unidadConcentracion}` : undefined,
      proveedorNombre: prov?.nombreProveedor, marcaNombre: marc?.nombreMarca,
    }]);
  }, [categorias, presentaciones, concentraciones, proveedores, marcas]);
  const updateProducto = useCallback((pr: Producto) => setProductos(p => p.map(x => x.productoId === pr.productoId ? pr : x)), []);
  const deleteProducto = useCallback((id: number) => setProductos(p => p.filter(x => x.productoId !== id)), []);

  // Compras — actualiza inventario al registrar
  const addCompra = useCallback((c: Omit<Compra, "compraId" | "numeroCompra">) => {
    setCompras(p => {
      const id = nextId(p, "compraId");
      const pad = String(id).padStart(3, "0");
      const año = new Date().getFullYear();
      return [...p, { ...c, compraId: id, numeroCompra: `CMP-${año}-${pad}` }];
    });
    // Actualizar inventario
    if (c.detalles) {
      setInventario(inv => inv.map(item => {
        const detalle = c.detalles!.find(d => d.productoId === item.productoId);
        if (detalle) {
          const newQty = item.cantidadDisponible + detalle.cantidad;
          return { ...item, cantidadDisponible: newQty, estado: newQty === 0 ? 'agotado' : newQty <= item.stockCritico ? 'critico' : 'normal' };
        }
        return item;
      }));
    }
  }, []);

  // Ventas — actualiza inventario al vender
  const addFactura = useCallback((f: Omit<Factura, "facturaId" | "numeroFactura">) => {
    setFacturas(p => {
      const id = nextId(p, "facturaId");
      const pad = String(id).padStart(3, "0");
      const año = new Date().getFullYear();
      return [...p, { ...f, facturaId: id, numeroFactura: `FAC-${año}-${pad}` }];
    });
    if (f.detalles) {
      setInventario(inv => inv.map(item => {
        const detalle = f.detalles!.find(d => d.productoId === item.productoId);
        if (detalle) {
          const newQty = Math.max(0, item.cantidadDisponible - detalle.cantidad);
          return { ...item, cantidadDisponible: newQty, estado: newQty === 0 ? 'agotado' : newQty <= item.stockCritico ? 'critico' : 'normal' };
        }
        return item;
      }));
    }
  }, []);

  return (
    <StoreContext.Provider value={{
      roles, usuarios, marcas, categorias, presentaciones, concentraciones, proveedores, metodosPago, productos, inventario, compras, facturas,
      addRol, updateRol, addUsuario, updateUsuario, addMarca, updateMarca, deleteMarca, addCategoria, updateCategoria, deleteCategoria,
      addPresentacion, updatePresentacion, addConcentracion, updateConcentracion, addProveedor, updateProveedor, addMetodoPago, updateMetodoPago,
      addProducto, updateProducto, deleteProducto, addCompra, addFactura,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
