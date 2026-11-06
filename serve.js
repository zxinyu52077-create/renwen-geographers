// 简易静态文件服务器：node serve.js [端口]
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.argv[2] || 8080;
const ROOT = __dirname;
const DEFAULT_PAGE = "中国人文地理学家名片集网页平台.html";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ico": "image/x-icon", ".json": "application/json; charset=utf-8"
};

http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/" || urlPath === "") urlPath = "/" + DEFAULT_PAGE;
    const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, ""));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    if (!stat || stat.isDirectory()) { res.writeHead(404); return res.end("404 Not Found"); }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end("Server Error");
  }
}).listen(PORT, () => console.log(`服务已启动: http://localhost:${PORT}`));
