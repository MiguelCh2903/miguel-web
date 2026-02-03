/**
 * Script para optimizar imágenes del portfolio
 * Convierte imágenes a formatos modernos (AVIF, WebP)
 *
 * Instalar dependencias ANTES de ejecutar:
 * pnpm add -D sharp
 *
 * Ejecutar:
 * pnpm tsx scripts/optimize-images.ts
 */

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = join(process.cwd(), "public");
const PROJECTS_DIR = join(PUBLIC_DIR, "projects");

async function optimizeImage(inputPath: string) {
  const ext = inputPath.split(".").pop()?.toLowerCase();

  // Solo procesar imágenes comunes
  if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
    return;
  }

  const basePath = inputPath.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  try {
    console.log(`🔄 Optimizando: ${inputPath}`);

    // Generar AVIF (mejor compresión, formato moderno)
    await sharp(inputPath)
      .avif({ quality: 75, effort: 6 })
      .toFile(`${basePath}.avif`);

    console.log(`✅ Generado: ${basePath}.avif`);

    // Generar WebP (fallback)
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(`${basePath}.webp`);

    console.log(`✅ Generado: ${basePath}.webp`);
  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error);
  }
}

async function processDirectory(dir: string) {
  try {
    const files = await readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        await processDirectory(filePath);
      } else {
        await optimizeImage(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando directorio ${dir}:`, error);
  }
}

async function main() {
  console.log("🚀 Iniciando optimización de imágenes...\n");

  await processDirectory(PROJECTS_DIR);

  console.log("\n✨ Optimización completada!");
  console.log(
    "📊 Formatos generados: AVIF (mejor compresión), WebP (fallback)",
  );
  console.log("💡 Next.js automáticamente servirá el formato más eficiente");
}

main().catch(console.error);
