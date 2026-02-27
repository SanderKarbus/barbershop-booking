// Bun-native server entrypoint (MVC)
import { serve } from "bun";
import path from "path";
import fs from "fs";
import { bookingController } from "./controllers/bookingController.js";
import { adminController } from "./controllers/adminController.js";

const PORT = process.env.PORT || 3001;
const buildPath = path.resolve(import.meta.dir, "../frontend/build");

serve({
  port: PORT,
  fetch: async (req) => {
    try {
      const url = new URL(req.url);
      if (url.pathname.startsWith("/api/bookings")) {
        return await bookingController(req, url);
      }
      if (url.pathname.startsWith("/api/admin")) {
        return await adminController(req, url);
      }
      // Simple admin panel
      if (url.pathname === "/admin") {
        return new Response(Bun.file(path.join(import.meta.dir, "admin_simple.html")), { 
          headers: { "Content-Type": "text/html" } 
        });
      }
      // Serve static files from React build
      let relPath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
      let filePath = path.join(buildPath, relPath);
      // Prevent path traversal
      console.log('Request:', url.pathname, '->', filePath);
      if (!filePath.startsWith(buildPath)) {
        return new Response("Not found", { status: 404 });
      }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType =
          ext === ".js" ? "application/javascript" :
          ext === ".css" ? "text/css" :
          ext === ".html" ? "text/html" :
          ext === ".json" ? "application/json" :
          ext === ".png" ? "image/png" :
          ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
          ext === ".svg" ? "image/svg+xml" :
          "application/octet-stream";
        return new Response(Bun.file(filePath), { headers: { "Content-Type": contentType } });
      }
      // SPA fallback: serve index.html for all unknown routes
      const indexPath = path.join(buildPath, "index.html");
      if (fs.existsSync(indexPath)) {
        return new Response(Bun.file(indexPath), { headers: { "Content-Type": "text/html" } });
      }
      return new Response("Not found", { status: 404 });
    } catch (err) {
      console.error('Fetch error:', err);
      return new Response("Internal server error", { status: 500 });
    }
  },
});
console.log(`Bun server running on http://localhost:${PORT}`);
