import type {
  Rol, Usuario, Marca, Categoria, Presentacion, Concentracion,
  Proveedor, MetodoPago, Producto, ItemInventario, Compra, Factura, KpiDashboard,
} from './types';

// ==================== Roles ====================
export const mockRoles: Rol[] = [
  { rolId: 1, nombreRol: 'Administrador', descripcion: 'Acceso total al sistema', estadoActivo: true },
  { rolId: 2, nombreRol: 'Vendedor', descripcion: 'Gestión de ventas e inventario', estadoActivo: true },
];

// ==================== Usuarios ====================
export const mockUsuarios: Usuario[] = [
  { usuarioId: 1, nombre: 'Carlos', apellido: 'Mendoza', correoElectronico: 'admin@farmacia.com', telefono: '8888-1234', nombreUsuario: 'cmendoza', estadoActivo: true, fechaCreacion: '2024-01-10T08:00:00', roles: ['Administrador'] },
  { usuarioId: 2, nombre: 'María', apellido: 'López', correoElectronico: 'mlopez@farmacia.com', telefono: '8877-5678', nombreUsuario: 'mlopez', estadoActivo: true, fechaCreacion: '2024-02-15T09:00:00', roles: ['Vendedor'] },
  { usuarioId: 3, nombre: 'José', apellido: 'García', correoElectronico: 'jgarcia@farmacia.com', telefono: '8866-9012', nombreUsuario: 'jgarcia', estadoActivo: true, fechaCreacion: '2024-03-01T10:00:00', roles: ['Vendedor'] },
  { usuarioId: 4, nombre: 'Ana', apellido: 'Martínez', correoElectronico: 'amartinez@farmacia.com', telefono: '8855-3456', nombreUsuario: 'amartinez', estadoActivo: false, fechaCreacion: '2024-01-20T11:00:00', roles: ['Vendedor'] },
];

// ==================== Marcas ====================
export const mockMarcas: Marca[] = [
  { marcaId: 1, nombreMarca: 'Pfizer', descripcion: 'Laboratorio farmacéutico multinacional', estadoActivo: true },
  { marcaId: 2, nombreMarca: 'Bayer', descripcion: 'Empresa farmacéutica alemana', estadoActivo: true },
  { marcaId: 3, nombreMarca: 'Roche', descripcion: 'Laboratorio suizo de biotecnología', estadoActivo: true },
  { marcaId: 4, nombreMarca: 'Novartis', descripcion: 'Empresa farmacéutica suiza', estadoActivo: true },
  { marcaId: 5, nombreMarca: 'Sanofi', descripcion: 'Laboratorio farmacéutico francés', estadoActivo: true },
  { marcaId: 6, nombreMarca: 'GlaxoSmithKline', descripcion: 'GSK - Empresa farmacéutica británica', estadoActivo: true },
  { marcaId: 7, nombreMarca: 'Genérico Nacional', descripcion: 'Producción genérica local', estadoActivo: true },
];

// ==================== Categorías ====================
export const mockCategorias: Categoria[] = [
  { categoriaId: 1, nombreCategoria: 'Analgésicos', descripcion: 'Medicamentos para el dolor', estadoActivo: true },
  { categoriaId: 2, nombreCategoria: 'Antibióticos', descripcion: 'Medicamentos contra infecciones bacterianas', estadoActivo: true },
  { categoriaId: 3, nombreCategoria: 'Antiinflamatorios', descripcion: 'Medicamentos para reducir la inflamación', estadoActivo: true },
  { categoriaId: 4, nombreCategoria: 'Antihipertensivos', descripcion: 'Medicamentos para la presión arterial', estadoActivo: true },
  { categoriaId: 5, nombreCategoria: 'Vitaminas y Suplementos', descripcion: 'Suplementos nutricionales', estadoActivo: true },
  { categoriaId: 6, nombreCategoria: 'Antiparasitarios', descripcion: 'Medicamentos contra parásitos', estadoActivo: true },
  { categoriaId: 7, nombreCategoria: 'Antiácidos', descripcion: 'Medicamentos para problemas gástricos', estadoActivo: true },
  { categoriaId: 8, nombreCategoria: 'Antidiabéticos', descripcion: 'Medicamentos para diabetes', estadoActivo: true },
];

// ==================== Presentaciones ====================
export const mockPresentaciones: Presentacion[] = [
  { presentacionId: 1, nombrePresentacion: 'Tableta', descripcion: 'Forma sólida oral', estadoActivo: true },
  { presentacionId: 2, nombrePresentacion: 'Cápsula', descripcion: 'Forma sólida encapsulada', estadoActivo: true },
  { presentacionId: 3, nombrePresentacion: 'Jarabe', descripcion: 'Forma líquida oral', estadoActivo: true },
  { presentacionId: 4, nombrePresentacion: 'Suspensión', descripcion: 'Líquido con partículas', estadoActivo: true },
  { presentacionId: 5, nombrePresentacion: 'Inyectable', descripcion: 'Administración parenteral', estadoActivo: true },
  { presentacionId: 6, nombrePresentacion: 'Crema', descripcion: 'Uso tópico', estadoActivo: true },
  { presentacionId: 7, nombrePresentacion: 'Supositorio', descripcion: 'Administración rectal', estadoActivo: true },
  { presentacionId: 8, nombrePresentacion: 'Gotas', descripcion: 'Solución en gotas', estadoActivo: true },
];

// ==================== Concentraciones ====================
export const mockConcentraciones: Concentracion[] = [
  { concentracionId: 1, valorConcentracion: '500', unidadConcentracion: 'mg', descripcion: '500 mg', estadoActivo: true },
  { concentracionId: 2, valorConcentracion: '250', unidadConcentracion: 'mg', descripcion: '250 mg', estadoActivo: true },
  { concentracionId: 3, valorConcentracion: '100', unidadConcentracion: 'mg', descripcion: '100 mg', estadoActivo: true },
  { concentracionId: 4, valorConcentracion: '50', unidadConcentracion: 'mg', descripcion: '50 mg', estadoActivo: true },
  { concentracionId: 5, valorConcentracion: '400', unidadConcentracion: 'mg', descripcion: '400 mg', estadoActivo: true },
  { concentracionId: 6, valorConcentracion: '125', unidadConcentracion: 'mg/5ml', descripcion: '125 mg/5ml', estadoActivo: true },
  { concentracionId: 7, valorConcentracion: '200', unidadConcentracion: 'mg/5ml', descripcion: '200 mg/5ml', estadoActivo: true },
  { concentracionId: 8, valorConcentracion: '10', unidadConcentracion: 'mg', descripcion: '10 mg', estadoActivo: true },
  { concentracionId: 9, valorConcentracion: '20', unidadConcentracion: 'mg', descripcion: '20 mg', estadoActivo: true },
  { concentracionId: 10, valorConcentracion: '1000', unidadConcentracion: 'mg', descripcion: '1000 mg', estadoActivo: true },
];

// ==================== Proveedores ====================
export const mockProveedores: Proveedor[] = [
  { proveedorId: 1, nombreProveedor: 'Distribuidora Farmacéutica del Norte', rnc: 'J001234567', correoElectronico: 'ventas@dfnorte.com.ni', telefono: '2552-1234', direccion: 'Km 3.5 Carretera Norte, Managua', estadoActivo: true },
  { proveedorId: 2, nombreProveedor: 'Laboratorios Ramos S.A.', rnc: 'J009876543', correoElectronico: 'pedidos@laboramos.com.ni', telefono: '2270-5678', direccion: 'Colonia Centroamérica, Managua', estadoActivo: true },
  { proveedorId: 3, nombreProveedor: 'Importaciones Médicas S.A.', rnc: 'J005432198', correoElectronico: 'info@impomedicas.com.ni', telefono: '2278-9012', direccion: 'Carretera Masaya Km 11.5, Managua', estadoActivo: true },
  { proveedorId: 4, nombreProveedor: 'Distribuciones Cruz Verde', rnc: 'J003216549', correoElectronico: 'despacho@cruzverde.com.ni', telefono: '2248-3456', direccion: 'Bo. El Bóer, Managua', estadoActivo: true },
  { proveedorId: 5, nombreProveedor: 'Farma Caribe Nicaragua', rnc: 'J007891234', correoElectronico: 'contacto@farmacaribe.com.ni', telefono: '2265-7890', direccion: 'Zona Franca Las Mercedes, Managua', estadoActivo: true },
];

// ==================== Métodos de Pago ====================
export const mockMetodosPago: MetodoPago[] = [
  { metodoPagoId: 1, nombreMetodoPago: 'Efectivo', descripcion: 'Pago en efectivo', estadoActivo: true },
  { metodoPagoId: 2, nombreMetodoPago: 'Tarjeta de Débito', descripcion: 'Pago con tarjeta de débito', estadoActivo: true },
  { metodoPagoId: 3, nombreMetodoPago: 'Tarjeta de Crédito', descripcion: 'Pago con tarjeta de crédito', estadoActivo: true },
  { metodoPagoId: 4, nombreMetodoPago: 'Transferencia Bancaria', descripcion: 'Transferencia electrónica', estadoActivo: true },
];

// ==================== Productos ====================
export const mockProductos: Producto[] = [
  { productoId: 1, nombreGenerico: 'Amoxicilina', nombreComercial: 'Amoxil', categoriaId: 2, categoriaNombre: 'Antibióticos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 1, concentracionDescripcion: '500 mg', proveedorId: 1, proveedorNombre: 'Distribuidora Farmacéutica del Norte', marcaId: 1, marcaNombre: 'Pfizer', estadoActivo: true, fechaCreacion: '2024-01-15T00:00:00' },
  { productoId: 2, nombreGenerico: 'Ibuprofeno', nombreComercial: 'Advil', categoriaId: 3, categoriaNombre: 'Antiinflamatorios', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 5, concentracionDescripcion: '400 mg', proveedorId: 2, proveedorNombre: 'Laboratorios Ramos S.A.', marcaId: 2, marcaNombre: 'Bayer', estadoActivo: true, fechaCreacion: '2024-01-15T00:00:00' },
  { productoId: 3, nombreGenerico: 'Paracetamol', nombreComercial: 'Tylenol', categoriaId: 1, categoriaNombre: 'Analgésicos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 1, concentracionDescripcion: '500 mg', proveedorId: 1, proveedorNombre: 'Distribuidora Farmacéutica del Norte', marcaId: 7, marcaNombre: 'Genérico Nacional', estadoActivo: true, fechaCreacion: '2024-01-16T00:00:00' },
  { productoId: 4, nombreGenerico: 'Amoxicilina', nombreComercial: 'Trimox', categoriaId: 2, categoriaNombre: 'Antibióticos', presentacionId: 3, presentacionNombre: 'Jarabe', concentracionId: 6, concentracionDescripcion: '125 mg/5ml', proveedorId: 3, proveedorNombre: 'Importaciones Médicas S.A.', marcaId: 1, marcaNombre: 'Pfizer', estadoActivo: true, fechaCreacion: '2024-01-17T00:00:00' },
  { productoId: 5, nombreGenerico: 'Losartán', nombreComercial: 'Cozaar', categoriaId: 4, categoriaNombre: 'Antihipertensivos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 3, concentracionDescripcion: '100 mg', proveedorId: 2, proveedorNombre: 'Laboratorios Ramos S.A.', marcaId: 3, marcaNombre: 'Roche', estadoActivo: true, fechaCreacion: '2024-01-18T00:00:00' },
  { productoId: 6, nombreGenerico: 'Metformina', nombreComercial: 'Glucophage', categoriaId: 8, categoriaNombre: 'Antidiabéticos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 1, concentracionDescripcion: '500 mg', proveedorId: 4, proveedorNombre: 'Distribuciones Cruz Verde', marcaId: 4, marcaNombre: 'Novartis', estadoActivo: true, fechaCreacion: '2024-01-19T00:00:00' },
  { productoId: 7, nombreGenerico: 'Azitromicina', nombreComercial: 'Zithromax', categoriaId: 2, categoriaNombre: 'Antibióticos', presentacionId: 2, presentacionNombre: 'Cápsula', concentracionId: 4, concentracionDescripcion: '50 mg', proveedorId: 5, proveedorNombre: 'Farma Caribe Nicaragua', marcaId: 1, marcaNombre: 'Pfizer', estadoActivo: true, fechaCreacion: '2024-01-20T00:00:00' },
  { productoId: 8, nombreGenerico: 'Omeprazol', nombreComercial: 'Prilosec', categoriaId: 7, categoriaNombre: 'Antiácidos', presentacionId: 2, presentacionNombre: 'Cápsula', concentracionId: 9, concentracionDescripcion: '20 mg', proveedorId: 1, proveedorNombre: 'Distribuidora Farmacéutica del Norte', marcaId: 5, marcaNombre: 'Sanofi', estadoActivo: true, fechaCreacion: '2024-01-21T00:00:00' },
  { productoId: 9, nombreGenerico: 'Atorvastatina', nombreComercial: 'Lipitor', categoriaId: 4, categoriaNombre: 'Antihipertensivos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 8, concentracionDescripcion: '10 mg', proveedorId: 3, proveedorNombre: 'Importaciones Médicas S.A.', marcaId: 1, marcaNombre: 'Pfizer', estadoActivo: true, fechaCreacion: '2024-01-22T00:00:00' },
  { productoId: 10, nombreGenerico: 'Vitamina C', nombreComercial: 'Redoxon', categoriaId: 5, categoriaNombre: 'Vitaminas y Suplementos', presentacionId: 1, presentacionNombre: 'Tableta', concentracionId: 10, concentracionDescripcion: '1000 mg', proveedorId: 2, proveedorNombre: 'Laboratorios Ramos S.A.', marcaId: 2, marcaNombre: 'Bayer', estadoActivo: true, fechaCreacion: '2024-01-23T00:00:00' },
];

// ==================== Inventario ====================
export const mockInventario: ItemInventario[] = [
  { productoId: 1, nombreGenerico: 'Amoxicilina', nombreComercial: 'Amoxil', presentacion: 'Tableta', concentracion: '500 mg', marca: 'Pfizer', proveedor: 'Distribuidora Farmacéutica del Norte', cantidadDisponible: 350, precioCompra: 45.00, precioVenta: 75.00, stockCritico: 50, numeroLote: 'LOT-2024-001', fechaVencimiento: '2026-06-30', estado: 'normal' },
  { productoId: 2, nombreGenerico: 'Ibuprofeno', nombreComercial: 'Advil', presentacion: 'Tableta', concentracion: '400 mg', marca: 'Bayer', proveedor: 'Laboratorios Ramos S.A.', cantidadDisponible: 28, precioCompra: 22.00, precioVenta: 38.00, stockCritico: 30, numeroLote: 'LOT-2024-002', fechaVencimiento: '2025-12-31', estado: 'critico' },
  { productoId: 3, nombreGenerico: 'Paracetamol', nombreComercial: 'Tylenol', presentacion: 'Tableta', concentracion: '500 mg', marca: 'Genérico Nacional', proveedor: 'Distribuidora Farmacéutica del Norte', cantidadDisponible: 500, precioCompra: 8.00, precioVenta: 15.00, stockCritico: 100, numeroLote: 'LOT-2024-003', fechaVencimiento: '2027-03-31', estado: 'normal' },
  { productoId: 4, nombreGenerico: 'Amoxicilina', nombreComercial: 'Trimox', presentacion: 'Jarabe', concentracion: '125 mg/5ml', marca: 'Pfizer', proveedor: 'Importaciones Médicas S.A.', cantidadDisponible: 15, precioCompra: 65.00, precioVenta: 110.00, stockCritico: 20, numeroLote: 'LOT-2024-004', fechaVencimiento: '2025-09-30', estado: 'critico' },
  { productoId: 5, nombreGenerico: 'Losartán', nombreComercial: 'Cozaar', presentacion: 'Tableta', concentracion: '100 mg', marca: 'Roche', proveedor: 'Laboratorios Ramos S.A.', cantidadDisponible: 200, precioCompra: 30.00, precioVenta: 55.00, stockCritico: 40, numeroLote: 'LOT-2024-005', fechaVencimiento: '2026-11-30', estado: 'normal' },
  { productoId: 6, nombreGenerico: 'Metformina', nombreComercial: 'Glucophage', presentacion: 'Tableta', concentracion: '500 mg', marca: 'Novartis', proveedor: 'Distribuciones Cruz Verde', cantidadDisponible: 0, precioCompra: 18.00, precioVenta: 32.00, stockCritico: 50, numeroLote: 'LOT-2024-006', fechaVencimiento: '2026-08-31', estado: 'agotado' },
  { productoId: 7, nombreGenerico: 'Azitromicina', nombreComercial: 'Zithromax', presentacion: 'Cápsula', concentracion: '50 mg', marca: 'Pfizer', proveedor: 'Farma Caribe Nicaragua', cantidadDisponible: 180, precioCompra: 55.00, precioVenta: 95.00, stockCritico: 30, numeroLote: 'LOT-2024-007', fechaVencimiento: '2025-08-15', estado: 'normal' },
  { productoId: 8, nombreGenerico: 'Omeprazol', nombreComercial: 'Prilosec', presentacion: 'Cápsula', concentracion: '20 mg', marca: 'Sanofi', proveedor: 'Distribuidora Farmacéutica del Norte', cantidadDisponible: 120, precioCompra: 25.00, precioVenta: 45.00, stockCritico: 25, numeroLote: 'LOT-2024-008', fechaVencimiento: '2026-04-30', estado: 'normal' },
  { productoId: 9, nombreGenerico: 'Atorvastatina', nombreComercial: 'Lipitor', presentacion: 'Tableta', concentracion: '10 mg', marca: 'Pfizer', proveedor: 'Importaciones Médicas S.A.', cantidadDisponible: 95, precioCompra: 40.00, precioVenta: 70.00, stockCritico: 30, numeroLote: 'LOT-2024-009', fechaVencimiento: '2025-07-31', estado: 'normal' },
  { productoId: 10, nombreGenerico: 'Vitamina C', nombreComercial: 'Redoxon', presentacion: 'Tableta', concentracion: '1000 mg', marca: 'Bayer', proveedor: 'Laboratorios Ramos S.A.', cantidadDisponible: 250, precioCompra: 12.00, precioVenta: 22.00, stockCritico: 40, numeroLote: 'LOT-2024-010', fechaVencimiento: '2027-01-31', estado: 'normal' },
];

// ==================== Compras ====================
export const mockCompras: Compra[] = [
  { compraId: 1, numeroCompra: 'CMP-2025-001', proveedorId: 1, proveedorNombre: 'Distribuidora Farmacéutica del Norte', usuarioId: 1, usuarioNombre: 'Carlos Mendoza', fechaCompra: '2025-06-01T10:00:00', subtotal: 18000.00, descuentoTotal: 500.00, totalCompra: 17500.00, observaciones: 'Pedido mensual rutinario', detalles: [{ productoId: 1, productoNombre: 'Amoxicilina 500mg', cantidad: 200, precioUnitarioCompra: 45.00, descuentoLinea: 0, subtotalLinea: 9000.00, totalLinea: 9000.00 }, { productoId: 3, productoNombre: 'Paracetamol 500mg', cantidad: 500, precioUnitarioCompra: 8.00, descuentoLinea: 500.00, subtotalLinea: 4000.00, totalLinea: 3500.00 }, { productoId: 8, productoNombre: 'Omeprazol 20mg', cantidad: 200, precioUnitarioCompra: 25.00, descuentoLinea: 0, subtotalLinea: 5000.00, totalLinea: 5000.00 }] },
  { compraId: 2, numeroCompra: 'CMP-2025-002', proveedorId: 2, proveedorNombre: 'Laboratorios Ramos S.A.', usuarioId: 1, usuarioNombre: 'Carlos Mendoza', fechaCompra: '2025-06-05T11:30:00', subtotal: 11200.00, descuentoTotal: 0, totalCompra: 11200.00, detalles: [{ productoId: 2, productoNombre: 'Ibuprofeno 400mg', cantidad: 200, precioUnitarioCompra: 22.00, descuentoLinea: 0, subtotalLinea: 4400.00, totalLinea: 4400.00 }, { productoId: 10, productoNombre: 'Vitamina C 1000mg', cantidad: 400, precioUnitarioCompra: 12.00, descuentoLinea: 0, subtotalLinea: 4800.00, totalLinea: 4800.00 }, { productoId: 5, productoNombre: 'Losartán 100mg', cantidad: 67, precioUnitarioCompra: 30.00, descuentoLinea: 0, subtotalLinea: 2010.00, totalLinea: 2010.00 }] },
  { compraId: 3, numeroCompra: 'CMP-2025-003', proveedorId: 3, proveedorNombre: 'Importaciones Médicas S.A.', usuarioId: 1, usuarioNombre: 'Carlos Mendoza', fechaCompra: '2025-06-10T09:15:00', subtotal: 13800.00, descuentoTotal: 800.00, totalCompra: 13000.00, detalles: [{ productoId: 4, productoNombre: 'Amoxicilina Jarabe 125mg/5ml', cantidad: 100, precioUnitarioCompra: 65.00, descuentoLinea: 500.00, subtotalLinea: 6500.00, totalLinea: 6000.00 }, { productoId: 9, productoNombre: 'Atorvastatina 10mg', cantidad: 185, precioUnitarioCompra: 40.00, descuentoLinea: 300.00, subtotalLinea: 7400.00, totalLinea: 7000.00 }] },
];

// ==================== Facturas (Ventas) ====================
export const mockFacturas: Factura[] = [
  { facturaId: 1, numeroFactura: 'FAC-2025-001', usuarioId: 2, usuarioNombre: 'María López', metodoPagoId: 1, metodoPagoNombre: 'Efectivo', fechaFactura: '2025-06-16T08:30:00', subtotal: 300.00, descuentoTotal: 0, totalFactura: 300.00, nombreCliente: 'Juan Pérez', detalles: [{ productoId: 3, productoNombre: 'Paracetamol 500mg', cantidad: 20, precioUnitarioVenta: 15.00, descuentoLinea: 0, subtotalLinea: 300.00, totalLinea: 300.00 }] },
  { facturaId: 2, numeroFactura: 'FAC-2025-002', usuarioId: 2, usuarioNombre: 'María López', metodoPagoId: 2, metodoPagoNombre: 'Tarjeta de Débito', fechaFactura: '2025-06-16T09:15:00', subtotal: 570.00, descuentoTotal: 20.00, totalFactura: 550.00, nombreCliente: 'Rosa Alemán', detalles: [{ productoId: 1, productoNombre: 'Amoxicilina 500mg', cantidad: 6, precioUnitarioVenta: 75.00, descuentoLinea: 20.00, subtotalLinea: 450.00, totalLinea: 430.00 }, { productoId: 8, productoNombre: 'Omeprazol 20mg', cantidad: 4, precioUnitarioVenta: 45.00, descuentoLinea: 0, subtotalLinea: 180.00, totalLinea: 120.00 }] },
  { facturaId: 3, numeroFactura: 'FAC-2025-003', usuarioId: 3, usuarioNombre: 'José García', metodoPagoId: 1, metodoPagoNombre: 'Efectivo', fechaFactura: '2025-06-16T10:00:00', subtotal: 220.00, descuentoTotal: 0, totalFactura: 220.00, detalles: [{ productoId: 10, productoNombre: 'Vitamina C 1000mg', cantidad: 10, precioUnitarioVenta: 22.00, descuentoLinea: 0, subtotalLinea: 220.00, totalLinea: 220.00 }] },
  { facturaId: 4, numeroFactura: 'FAC-2025-004', usuarioId: 2, usuarioNombre: 'María López', metodoPagoId: 3, metodoPagoNombre: 'Tarjeta de Crédito', fechaFactura: '2025-06-16T11:45:00', subtotal: 1045.00, descuentoTotal: 45.00, totalFactura: 1000.00, nombreCliente: 'Luis Hernández', detalles: [{ productoId: 5, productoNombre: 'Losartán 100mg', cantidad: 10, precioUnitarioVenta: 55.00, descuentoLinea: 0, subtotalLinea: 550.00, totalLinea: 550.00 }, { productoId: 6, productoNombre: 'Metformina 500mg', cantidad: 10, precioUnitarioVenta: 32.00, descuentoLinea: 0, subtotalLinea: 320.00, totalLinea: 320.00 }, { productoId: 3, productoNombre: 'Paracetamol 500mg', cantidad: 15, precioUnitarioVenta: 15.00, descuentoLinea: 45.00, subtotalLinea: 225.00, totalLinea: 130.00 }] },
];

// ==================== KPI Dashboard ====================
export const mockKpi: KpiDashboard = {
  ventasHoy: 2070.00,
  comprasHoy: 0,
  productosActivos: 10,
  alertasInventario: 3,
  ventasMes: 42500.00,
  comprasMes: 41700.00,
  gananciaMes: 18340.00,
};

// ==================== Datos para gráficas ====================
export const ventasMensuales = [
  { mes: 'Ene', ventas: 32000, compras: 28000 },
  { mes: 'Feb', ventas: 35000, compras: 30000 },
  { mes: 'Mar', ventas: 29000, compras: 25000 },
  { mes: 'Abr', ventas: 40000, compras: 35000 },
  { mes: 'May', ventas: 38000, compras: 32000 },
  { mes: 'Jun', ventas: 42500, compras: 41700 },
];

export const ventasPorCategoria = [
  { categoria: 'Analgésicos', total: 12400 },
  { categoria: 'Antibióticos', total: 9800 },
  { categoria: 'Antiinflamatorios', total: 7200 },
  { categoria: 'Antihipertensivos', total: 8500 },
  { categoria: 'Vitaminas', total: 4600 },
];

export const ventasPorHora = [
  { hora: '7am', ventas: 12 }, { hora: '8am', ventas: 28 }, { hora: '9am', ventas: 45 },
  { hora: '10am', ventas: 62 }, { hora: '11am', ventas: 55 }, { hora: '12pm', ventas: 38 },
  { hora: '1pm', ventas: 22 }, { hora: '2pm', ventas: 35 }, { hora: '3pm', ventas: 58 },
  { hora: '4pm', ventas: 72 }, { hora: '5pm', ventas: 68 }, { hora: '6pm', ventas: 40 },
];

export const topProductos = [
  { nombre: 'Paracetamol 500mg', vendidos: 520, ganancia: 3640 },
  { nombre: 'Amoxicilina 500mg', vendidos: 310, ganancia: 9300 },
  { nombre: 'Ibuprofeno 400mg', vendidos: 280, ganancia: 4480 },
  { nombre: 'Vitamina C 1000mg', vendidos: 240, ganancia: 2400 },
  { nombre: 'Omeprazol 20mg', vendidos: 190, ganancia: 3800 },
];
