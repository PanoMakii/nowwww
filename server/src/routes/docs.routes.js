import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const openApiPath = join(__dirname, '../docs/openapi.json');

// Read OpenAPI spec once
let openApiSpec = {};
try {
  openApiSpec = JSON.parse(readFileSync(openApiPath, 'utf-8'));
} catch (err) {
  console.error('[Docs] Failed to load openapi.json:', err);
}

// Serve raw OpenAPI JSON for Postman / Insomnia
router.get(['/openapi.json', '/json'], (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiSpec);
});

// Interactive API Documentation Page (Dark Theme Swagger / Redoc UI)
router.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recip52 API Reference &amp; Developer Hub</title>
  <link rel="icon" type="image/svg+xml" href="/assets/recip52-icon-horizontal-Green-MHuqcTAx.svg" />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #141210;
      color: #E5E0D8;
      font-family: 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #redoc-container {
      max-width: 100%;
    }
  </style>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</head>
<body>
  <div id="redoc-container"></div>
  <script>
    Redoc.init(
      '/api/docs/openapi.json',
      {
        theme: {
          colors: {
            primary: {
              main: '#F4C430'
            },
            success: {
              main: '#7BB661'
            },
            text: {
              primary: '#E5E0D8',
              secondary: '#8C867E'
            },
            http: {
              get: '#7BB661',
              post: '#F4C430',
              put: '#E5A812',
              delete: '#FF6347'
            }
          },
          typography: {
            fontFamily: "'Hanken Grotesk', sans-serif",
            headings: {
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: '700'
            },
            code: {
              fontFamily: "'JetBrains Mono', monospace"
            }
          },
          sidebar: {
            backgroundColor: '#1A1817',
            textColor: '#E5E0D8',
            activeTextColor: '#F4C430'
          },
          rightPanel: {
            backgroundColor: '#0E0C0B'
          }
        },
        scrollYOffset: 0,
        expandResponses: "200,201",
        requiredPropsFirst: true,
        nativeScrollbars: true,
        hideDownloadButton: false
      },
      document.getElementById('redoc-container')
    );
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
