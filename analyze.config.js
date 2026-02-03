/** @type {import('next').NextConfig} */

// Configuración para analizar el bundle size
// Ejecutar: ANALYZE=true pnpm build

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer;
