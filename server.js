// Servidor estático nativo para la plataforma Opositor · AGE.
// Compatible con ejecución local (node server.js [--open]) y despliegues en Vercel.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5500;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function handler(req, res) {
  let pathname = decodeURIComponent(req.url.split('?')[0]);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(ROOT, path.normalize(pathname));

  // Evita salir de la carpeta raíz del proyecto.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    // Si el archivo no existe (por ejemplo, una ruta interna de la aplicación), sirve index.html
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(ROOT, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, data) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 - No encontrado');
        } else {
          res.writeHead(200, { 'Content-Type': MIME['.html'] });
          res.end(data);
        }
      });
      return;
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - Error interno');
        return;
      }
      const tipo = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': tipo });
      res.end(data);
    });
  });
}

// Exportar el manejador para Vercel Serverless
module.exports = handler;

// Arrancar puerto de escucha local únicamente si se ejecuta directamente con Node
if (require.main === module && !process.env.VERCEL) {
  const server = http.createServer(handler);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`El puerto ${PORT} está ocupado. Prueba otro: $env:PORT=5501; node server.js`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });

  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}/`;
    console.log(`Opositor AGE en marcha: ${url}`);
    console.log('Pulsa Ctrl+C para detener el servidor.');
    if (process.argv.includes('--open')) {
      const cmd =
        process.platform === 'win32'
          ? `start "" "${url}"`
          : process.platform === 'darwin'
            ? `open "${url}"`
            : `xdg-open "${url}"`;
      exec(cmd);
    }
  });
}
