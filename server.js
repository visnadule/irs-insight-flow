import { createReadStream, existsSync, statSync } from "fs";
import { createServer } from "http";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const dist = join(__dirname, "dist");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".map": "application/json",
};

function tryFile(p) {
  try {
    return existsSync(p) && statSync(p).isFile() ? p : null;
  } catch {
    return null;
  }
}

createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  const filePath = join(dist, url);

  const file =
    tryFile(filePath) ||
    tryFile(join(filePath, "index.html")) ||
    join(dist, "index.html");

  const ext = extname(file);
  res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
  res.setHeader(
    "Cache-Control",
    ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable"
  );

  createReadStream(file)
    .on("error", () => {
      res.statusCode = 500;
      res.end("Server Error");
    })
    .pipe(res);
}).listen(5000, "0.0.0.0", () => {
  console.log("Serving on http://0.0.0.0:5000");
});
