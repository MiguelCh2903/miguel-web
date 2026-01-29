# Estructura de Proyectos

Esta carpeta contiene las imágenes organizadas por proyecto. **Las imágenes se detectan automáticamente**.

## Estructura

Cada proyecto tiene su propia carpeta con imágenes numeradas:

```
projects/
├── lidar/
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
├── anomalias/
│   └── 1.png
├── agentes/
│   └── (agregar imágenes aquí)
├── robot-guia/
│   └── 1.jpeg
├── hexapodo/
│   └── 1.png
└── inchworm/
    └── (agregar imágenes aquí)
```

## Cómo agregar imágenes

1. **Simplemente coloca tus imágenes en la carpeta del proyecto correspondiente**
2. Nómbralas secuencialmente: `1.png`, `2.png`, `3.jpg`, etc.
3. **¡Eso es todo!** El sistema las detectará automáticamente

No necesitas editar ningún archivo de código. El sistema escanea automáticamente las carpetas y carga todas las imágenes disponibles.

## Formatos soportados

- PNG
- JPG/JPEG
- WebP
- GIF

## Características

- **Detección automática**: Las imágenes se cargan automáticamente desde las carpetas
- **Carrusel automático**: En las tarjetas, las imágenes rotan cada 3 segundos si hay más de una
- **Transiciones suaves**: Cambios fluidos entre imágenes con animaciones elegantes
- **Indicadores**: Puntos que muestran cuántas imágenes tiene cada proyecto
- **Modal con carrusel**: Al hacer clic en un proyecto, se abre un diálogo con navegación manual
- **Responsive**: Las imágenes se adaptan usando `object-contain` para evitar distorsión

