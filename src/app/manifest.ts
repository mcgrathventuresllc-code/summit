import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Summit - Gamified Healthy Living",
    short_name: "Summit",
    description: "Fitness, budget, reading & recovery. One app to climb higher.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#10b981",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["fitness", "health", "lifestyle", "finance"],
  };
}
