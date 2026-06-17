// ===========================
// Tipos del Sistema Farma-Di
// ===========================

export type Rol = {
  rolId: number;
  nombreRol: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Usuario = {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono: string;
  nombreUsuario: string;
  estadoActivo: boolean;
  fechaCreacion: string;
  roles: string[];
};

export type Marca = {
  marcaId: number;
  nombreMarca: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Categoria = {
  categoriaId: number;
  nombreCategoria: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Presentacion = {
  presentacionId: number;
  nombrePresentacion: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Concentracion = {
  concentracionId: number;
  valorConcentracion: string;
  unidadConcentracion: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Proveedor = {
  proveedorId: number;
  nombreProveedor: string;
  rnc?: string;
  correoElectronico: string;
  telefono: string;
  direccion: string;
  estadoActivo: boolean;
};

export type MetodoPago = {
  metodoPagoId: number;
  nombreMetodoPago: string;
  descripcion?: string;
  estadoActivo: boolean;
};

export type Producto = {
  productoId: number;
  nombreGenerico: string;
  nombreComercial?: string;
  categoriaId: number;
  categoriaNombre?: string;
  presentacionId: number;
  presentacionNombre?: string;
  concentracionId: number;
  concentracionDescripcion?: string;
  proveedorId: number;
  proveedorNombre?: string;
  marcaId: number;
  marcaNombre?: string;
  estadoActivo: boolean;
  fechaCreacion: string;
};

export type ItemInventario = {
  productoId: number;
  nombreGenerico: string;
  nombreComercial: string;
  presentacion: string;
  concentracion: string;
  marca: string;
  proveedor: string;
  cantidadDisponible: number;
  precioCompra: number;
  precioVenta: number;
  stockCritico: number;
  numeroLote?: string;
  fechaVencimiento?: string;
  estado: 'normal' | 'critico' | 'agotado';
};

export type DetalleCompra = {
  detalleCompraId?: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitarioCompra: number;
  descuentoLinea: number;
  subtotalLinea: number;
  totalLinea: number;
};

export type Compra = {
  compraId: number;
  numeroCompra: string;
  proveedorId: number;
  proveedorNombre?: string;
  usuarioId: number;
  usuarioNombre?: string;
  fechaCompra: string;
  subtotal: number;
  descuentoTotal: number;
  totalCompra: number;
  observaciones?: string;
  detalles?: DetalleCompra[];
};

export type DetalleVenta = {
  detalleVentaId?: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitarioVenta: number;
  descuentoLinea: number;
  subtotalLinea: number;
  totalLinea: number;
};

export type Factura = {
  facturaId: number;
  numeroFactura: string;
  usuarioId: number;
  usuarioNombre?: string;
  metodoPagoId: number;
  metodoPagoNombre?: string;
  fechaFactura: string;
  subtotal: number;
  descuentoTotal: number;
  totalFactura: number;
  nombreCliente?: string;
  observaciones?: string;
  detalles?: DetalleVenta[];
};

export type KpiDashboard = {
  ventasHoy: number;
  comprasHoy: number;
  productosActivos: number;
  alertasInventario: number;
  ventasMes: number;
  comprasMes: number;
  gananciaMes: number;
};

export type AuthUser = {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  nombreUsuario: string;
  roles: string[];
  token: string;
};
