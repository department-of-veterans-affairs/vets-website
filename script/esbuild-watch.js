#!/usr/bin/env node

/**
 * esbuild watch mode with a development server.
 *
 * Replaces `yarn watch` (webpack-dev-server) with esbuild's native
 * serve + watch for dramatically faster rebuilds.
 *
 * Usage:
 *   node script/esbuild-watch.js [options]
 *
 * Options:
 *   --entry=<apps>       Comma-separated list of app entry names
 *   --api=<url>          Remote API URL (proxied through dev server)
 *   --port=<num>         Dev server port (default: 3001)
 *   --host=<addr>        Dev server host (default: 127.0.0.1)
 *   --scaffold           Generate HTML scaffold pages
 */

/* eslint-disable no-console */

const esbuild = require('esbuild');
const http = require('http');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const { buildConfig } = require('../config/esbuild.config');
const { getAppManifests } = require('../config/manifest-helpers');

const rootDir = path.resolve(__dirname, '..');

// Data needed by the dev template (same as webpack.config.js)
const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json');
const facilitySidebar = require('@department-of-veterans-affairs/platform-landing-pages/facility-sidebar');
const scaffoldRegistry = require('../src/applications/registry.scaffold.json');

// Load the dev template and compile it once
const devTemplatePath = path.join(
  rootDir,
  'node_modules/@department-of-veterans-affairs/platform-landing-pages/dev-template.ejs',
);
const devTemplateSource = fs.readFileSync(devTemplatePath, 'utf8');
const devTemplate = _.template(devTemplateSource);

// Load inline script assets from content-build (same as webpack getScaffoldAssets)
function loadInlineScriptAssets() {
  const contentBuildRoot = path.resolve(rootDir, '../content-build');
  const assets = {};
  for (const filename of ['record-event.js', 'static-page-widgets.js']) {
    const localPath = path.join(
      contentBuildRoot,
      'src/site/assets/js',
      filename,
    );
    if (fs.existsSync(localPath)) {
      assets[filename] = fs.readFileSync(localPath, 'utf8');
    } else {
      // Provide a no-op fallback if content-build is not available
      assets[filename] = '// content-build asset not available';
      console.warn(`  Warning: ${filename} not found at ${localPath}`);
    }
  }
  return assets;
}

const scaffoldAssets = loadInlineScriptAssets();

// Parse CLI arguments
// Supports both --key=value and webpack-style --env key=value
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--env' && args[i + 1]) {
    // webpack-style: --env entry=medications
    const [key, value] = args[i + 1].split('=');
    options[key] = value === undefined ? true : value;
    i += 1; // skip next arg
  } else if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value === undefined ? true : value;
  }
}

const port = parseInt(options.port || '3001', 10);
const host = options.host || '127.0.0.1';

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.map': 'application/json',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

async function startDevServer() {
  const buildOptions = {
    buildtype: 'localhost',
    entry: options.entry || undefined,
    api: options.api || '',
    destination: 'localhost',
    watch: true,
  };

  const { config, buildPath } = await buildConfig(buildOptions);

  // Add a plugin to log rebuild timings
  let buildStartTime;
  config.plugins.push({
    name: 'rebuild-timer',
    setup(build) {
      build.onStart(() => {
        buildStartTime = Date.now();
      });
      build.onEnd(result => {
        const elapsed = Date.now() - buildStartTime;
        const errors = result.errors.length;
        const warnings = result.warnings.length;
        const status = errors ? `with ${errors} error(s)` : 'successfully';
        const warn = warnings ? `, ${warnings} warning(s)` : '';
        console.log(`  esbuild: Rebuilt ${status} in ${elapsed}ms${warn}`);
      });
    },
  });

  // Create esbuild context for incremental builds
  const ctx = await esbuild.context(config);

  // Start watching
  await ctx.watch();
  console.log('  esbuild: Watching for changes...\n');

  // Build app route rewrites for SPA support, including registry data
  const manifests = getAppManifests();
  const registryMap = new Map();

  // Build lookup from registry.scaffold.json for widgetType/template metadata
  for (const entry of scaffoldRegistry) {
    if (entry.rootUrl) {
      registryMap.set(entry.rootUrl, entry);
    }
  }

  const appRoutes = manifests
    .map(m => {
      const registryEntry = registryMap.get(m.rootUrl) || {};
      return {
        rootUrl: m.rootUrl,
        entryName: m.entryName,
        appName: m.appName,
        widgetType: registryEntry.widgetType,
        widgetTemplate: registryEntry.widgetTemplate,
        template: registryEntry.template || {},
      };
    })
    .filter(m => m.rootUrl)
    .sort((a, b) => b.rootUrl.length - a.rootUrl.length);

  /**
   * Generate a dev HTML page using the same lodash/EJS template that
   * webpack uses (dev-template.ejs), with esbuild-specific script tags.
   */
  function generateDevHtml(appRoute) {
    const {
      entryName,
      appName,
      widgetType,
      widgetTemplate,
      template,
    } = appRoute;

    // Build script/style tags that the template expects from HtmlWebpackPlugin.
    // The template calls modifyScriptAndStyleTags(htmlWebpackPlugin.tags.headTags)
    // to sort and render them. We build tag objects matching that shape.
    const headTags = [
      // CSS links
      {
        attributes: { href: '/generated/style.entry.css', rel: 'stylesheet' },
        tagName: 'link',
      },
      {
        attributes: {
          href: '/generated/web-components.entry.css',
          rel: 'stylesheet',
        },
        tagName: 'link',
      },
      {
        attributes: {
          href: `/generated/${entryName}.entry.css`,
          rel: 'stylesheet',
        },
        tagName: 'link',
      },
      // JS scripts (IIFE, loaded with defer)
      {
        attributes: { src: '/generated/polyfills.entry.js', defer: true },
        tagName: 'script',
      },
      {
        attributes: {
          src: '/generated/web-components.entry.js',
          defer: true,
        },
        tagName: 'script',
      },
      {
        attributes: { src: `/generated/${entryName}.entry.js`, defer: true },
        tagName: 'script',
      },
    ];

    // Replicate the modifyScriptAndStyleTags function from webpack.config.js
    // Scripts use defer attribute for ordered loading.
    const modifyScriptAndStyleTags = originalTags => {
      const styleTags = [];
      const scriptTags = [];

      originalTags.forEach(tag => {
        if (tag.tagName === 'link' && tag.attributes.href) {
          if (tag.attributes.href.includes('style')) {
            styleTags.unshift(tag);
          } else {
            styleTags.push(tag);
          }
        } else if (tag.tagName === 'script' && tag.attributes.src) {
          if (tag.attributes.src.includes('polyfills')) {
            scriptTags.unshift(tag);
          } else {
            scriptTags.push(tag);
          }
        }
      });

      const allTags = [...styleTags, ...scriptTags];
      return allTags
        .map(tag => {
          const attrs = Object.entries(tag.attributes)
            .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
            .join(' ');
          if (tag.tagName === 'script') {
            return `<script ${attrs}></script>`;
          }
          return `<${tag.tagName} ${attrs}>`;
        })
        .join('\n    ');
    };

    try {
      let title = 'VA.gov Home | Veterans Affairs';
      if (template && template.title) {
        title = `${template.title} | Veterans Affairs`;
      } else if (appName) {
        title = `${appName} | Veterans Affairs`;
      }

      let html = devTemplate({
        htmlWebpackPlugin: {
          options: { title },
          tags: { headTags },
        },
        headerFooterData,
        facilitySidebar,
        loadInlineScript: filename => scaffoldAssets[filename] || '',
        modifyScriptAndStyleTags,
        breadcrumbs_override: [], // eslint-disable-line camelcase
        includeBreadcrumbs: false,
        loadingMessage: 'Please wait while we load the application for you.',
        entryName,
        widgetType,
        widgetTemplate,
        rootUrl: appRoute.rootUrl,
        ...(template || {}),
      });

      // Patch dev-template markup to match production (content-build) styling
      html = html.replace(
        'class="va-crisis-line-container"',
        'class="va-crisis-line-container vads-u-background-color--secondary-darkest"',
      );

      return html;
    } catch (err) {
      console.error(
        `  Error rendering template for ${entryName}:`,
        err.message,
      );
      // Fallback to a minimal HTML page
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${entryName} | VA.gov (esbuild dev)</title>
  <link rel="stylesheet" href="/generated/style.entry.css">
  <link rel="stylesheet" href="/generated/web-components.entry.css">
  <link rel="stylesheet" href="/generated/${entryName}.entry.css">
  <script>
    window.VetsGov = window.VetsGov || {};
    window.VetsGov.headerFooter = ${JSON.stringify(headerFooterData)};
  </script>
</head>
<body class="merger">
  <div id="content"><div id="react-root"></div></div>
  <div id="footerNav"></div>
  <script defer src="/generated/${entryName}.entry.js"></script>
</body>
</html>`;
    }
  }

  // Create a simple dev server that serves the build output
  const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];

    // Try to serve from generated/ first
    const generatedPath = path.join(buildPath, 'generated', urlPath);
    if (urlPath.startsWith('/generated/') && fs.existsSync(generatedPath)) {
      return serveFile(res, generatedPath);
    }

    // Try to serve static files from the build directory
    const staticPath = path.join(buildPath, urlPath);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      return serveFile(res, staticPath);
    }

    // SPA rewrite: match app routes and serve generated HTML
    for (const appRoute of appRoutes) {
      if (
        urlPath === appRoute.rootUrl ||
        urlPath.startsWith(`${appRoute.rootUrl}/`)
      ) {
        // First try a pre-built index.html
        const indexPath = path.join(buildPath, appRoute.rootUrl, 'index.html');
        if (fs.existsSync(indexPath)) {
          return serveFile(res, indexPath);
        }
        // Fall back to dynamically generated dev HTML
        const html = generateDevHtml(appRoute);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
      }
    }

    // Fall back to root index.html
    const rootIndex = path.join(buildPath, 'index.html');
    if (fs.existsSync(rootIndex)) {
      return serveFile(res, rootIndex);
    }

    res.writeHead(404);
    res.end('Not Found');
    return undefined;
  });

  server.listen(port, host, () => {
    console.log(`  Dev server running at http://${host}:${port}`);
    console.log(`  Serving from: ${buildPath}\n`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n  Shutting down...');
    await ctx.dispose();
    server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await ctx.dispose();
    server.close();
    process.exit(0);
  });
}

startDevServer().catch(err => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
