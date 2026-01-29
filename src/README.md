# SnackStock Frontend - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── assets/              # Imágenes, iconos y recursos estáticos
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI básicos (Button, Input, Card)
│   ├── Logo.tsx
│   ├── ProductCard.tsx
│   ├── RecipeModal.tsx
│   └── ScanSection.tsx
├── context/            # Contextos de React (Estado global)
│   ├── AuthContext.tsx       # Autenticación de usuarios
│   └── NavigationContext.tsx # Navegación entre páginas
├── layouts/            # Layouts de la aplicación
│   └── MainLayout.tsx  # Layout principal con sidebar
├── pages/              # Páginas de la aplicación
│   ├── Login.tsx       # Página de inicio de sesión
│   ├── Dashboard.tsx   # Vista principal de despensa
│   ├── Inventory.tsx   # Gestión de inventario
│   ├── Recipes.tsx     # Recetas guardadas
│   └── Statistics.tsx  # Estadísticas de consumo
├── services/           # Servicios y APIs
│   └── api.ts         # Llamadas al backend
├── App.tsx            # Componente principal con rutas
├── main.tsx           # Punto de entrada
└── types.ts           # Tipos TypeScript globales
```

## 🎯 Descripción de Funcionalidades

### Autenticación
- **Login**: Sistema de autenticación con email y contraseña
- **Persistencia**: Sesión guardada en localStorage
- **Protección**: Rutas protegidas que requieren autenticación

### Páginas Principales

#### 1. Dashboard
- Vista principal de la despensa
- Escaneo de boletas con OCR
- Listado de productos con estados (crítico, atención, óptimo)
- Generación de recetas con IA para productos por vencer

#### 2. Inventory (Inventario)
- Tabla completa de productos
- Búsqueda y filtros por categoría
- Gestión CRUD de productos
- Vista detallada con días restantes y estados

#### 3. Recipes (Recetas)
- Recetas generadas con IA
- Filtro de búsqueda
- Favoritos
- Información nutricional y tiempos de preparación

#### 4. Statistics (Estadísticas)
- Productos más consumidos
- Productos menos consumidos
- Métricas de desperdicio evitado
- Recomendaciones inteligentes

## 🔧 Componentes Principales

### Contextos
- **AuthContext**: Maneja login, logout y estado de autenticación
- **NavigationContext**: Controla la navegación entre páginas

### Componentes UI
- **Button**: Botón reutilizable con variantes (primary, secondary, danger, ghost)
- **Input**: Input con soporte para iconos y validación
- **Card**: Tarjeta contenedora con variantes

### Componentes de Negocio
- **ProductCard**: Tarjeta de producto con información y acciones
- **ScanSection**: Sección hero para escanear boletas
- **RecipeModal**: Modal para mostrar recetas generadas
- **Logo**: Logo de la aplicación

## 🚀 Flujo de la Aplicación

1. Usuario inicia sesión en `/Login`
2. Se redirige a Dashboard (vista principal)
3. Puede navegar entre secciones usando el sidebar:
   - Dashboard: Ver despensa y escanear boletas
   - Inventario: Gestionar productos
   - Recetas: Ver recetas guardadas
   - Estadísticas: Analizar consumo
4. Cada página consume datos del backend vía `/services/api.ts`

## 📝 Próximas Mejoras

- [ ] Implementar React Router para URLs
- [ ] Agregar tests unitarios
- [ ] Implementar paginación en tablas
- [ ] Agregar modo oscuro
- [ ] Notificaciones push para productos por vencer
- [ ] Gráficos en estadísticas
- [ ] Exportar reportes PDF
- [ ] Compartir recetas

## 🔗 Integración con Backend

El frontend se conecta al backend Express ubicado en `backend-express-snackstock-main/` a través de los servicios definidos en `src/services/api.ts`.

### Endpoints utilizados:
- `GET /api/inventory` - Obtener productos
- `POST /api/scan` - Procesar boleta
- `POST /api/recipe` - Generar receta con IA
