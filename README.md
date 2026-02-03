# Portfolio - Miguel Chumacero

Portfolio personal optimizado para Vercel, con sistema de chat IA y arquitectura RAG.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2 con React Compiler
- **Estilos**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **AI/ML**: 
  - Groq (LLaMA 3.3 70B) para chat
  - OpenAI embeddings para RAG
  - Sistema de vectores pre-computados
- **Runtime**: Vercel Edge Runtime
- **Linter**: Biome

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys
```

## 🔑 Variables de Entorno

Crear archivo `.env.local`:

```env
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
```

## 🛠️ Desarrollo

```bash
# Modo desarrollo con Turbopack
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linter
pnpm lint

# Formatear código
pnpm format
```

## 📊 Scripts Útiles

```bash
# Generar embeddings vectoriales (ejecutar al actualizar contenido)
pnpm generate-embeddings

# Optimizar imágenes a AVIF/WebP (requiere sharp)
pnpm optimize-images

# Analizar tamaño del bundle
pnpm analyze
```

## 🎯 Optimizaciones Implementadas

Ver [OPTIMIZATIONS.md](OPTIMIZATIONS.md) para detalles completos.

### Performance
- ✅ Lazy loading de componentes pesados
- ✅ Image optimization con Next/Image
- ✅ Edge Runtime para APIs
- ✅ React Compiler habilitado
- ✅ Tree-shaking automático
- ✅ Code splitting por ruta

### SEO
- ✅ Metadata completa (Open Graph, Twitter Cards)
- ✅ Sitemap.xml dinámico
- ✅ Robots.txt optimizado
- ✅ Structured data (JSON-LD)

### Caché
- ✅ Assets estáticos: 1 año
- ✅ Imágenes: 30 días
- ✅ API routes: no-cache

## 🚢 Despliegue en Vercel

### Opción 1: Vercel CLI

```bash
# Instalar CLI
pnpm add -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Opción 2: GitHub Integration

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno en Vercel Dashboard
3. Push a `main` despliega automáticamente

### Variables en Vercel

Configurar en **Settings → Environment Variables**:

- `OPENAI_API_KEY`: Tu API key de OpenAI
- `GROQ_API_KEY`: Tu API key de Groq

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/chat/          # API route con Edge Runtime
│   ├── layout.tsx         # Layout principal con metadata
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/
│   ├── sections/          # Secciones del portfolio
│   ├── ui/                # Componentes UI (shadcn)
│   └── ai-chat-sidebar.tsx
├── lib/
│   ├── embeddings.json    # Vector DB pre-computado
│   ├── knowledge-base.json
│   └── rag-system.ts      # Sistema RAG optimizado
├── scripts/
│   ├── generate-embeddings.ts
│   └── optimize-images.ts
├── public/
│   └── projects/          # Imágenes de proyectos
├── next.config.ts         # Configuración optimizada
└── vercel.json            # Config específica de Vercel
```

## 🎨 Personalización

### Actualizar Contenido

1. Editar `lib/knowledge-base.json` con tu información
2. Regenerar embeddings: `pnpm generate-embeddings`
3. Commit y push

### Agregar Proyectos

1. Agregar imágenes en `public/projects/[nombre-proyecto]/`
2. Actualizar `components/sections/Projects.tsx`
3. Actualizar `knowledge-base.json`

### Optimizar Imágenes

```bash
# Convertir todas las imágenes a AVIF/WebP
pnpm optimize-images
```

## 📈 Métricas

### Core Web Vitals Objetivo
- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

### Bundle Size
- **First Load JS**: ~85KB
- **Chat Sidebar**: ~25KB (lazy loaded)

## 🔧 Troubleshooting

### Error: "Module not found"
```bash
pnpm install
```

### Error en embeddings
```bash
pnpm generate-embeddings
```

### Imágenes no optimizadas
```bash
pnpm optimize-images
```

## 📝 Licencia

MIT

---

**Desarrollado por**: Miguel Chumacero  
**Contacto**: [Tu email/LinkedIn]  
**Deploy**: [tu-portfolio.vercel.app](https://tu-portfolio.vercel.app)
