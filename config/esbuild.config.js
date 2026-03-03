/* eslint-disable no-console */

/**
 * esbuild configuration for vets-website.
 *
 * This replaces the webpack-based JS/CSS bundling with esbuild for
 * significantly faster cold builds. It reuses the same manifest-helpers,
 * environment constants, and alias map so that the output is drop-in
 * compatible with the existing build pipeline.
 *
 * What esbuild handles here:
 *  - JS/JSX/TS/TSX transpilation and bundling (replaces babel-loader + webpack)
 *  - SCSS/CSS compilation and extraction (replaces sass-loader + MiniCssExtractPlugin)
 *  - Asset inlining for images and fonts (replaces url-loader / file-loader)
 *  - DefinePlugin-style global replacements
 *  - Self-contained IIFE bundles per entry (replaces splitChunks — each entry
 *    gets all its dependencies inlined for HTTP/1 compatibility)
 *  - File manifest generation (replaces WebpackManifestPlugin)
 *  - Static file copying (replaces CopyPlugin)
 *
 * What is NOT handled by esbuild (stays in webpack or separate tooling):
 *  - HTML scaffold generation (HtmlWebpackPlugin) – handled by a small
 *    post-build step or left to the content-build pipeline.
 *  - webpack-dev-server / HMR – the watch script uses esbuild's built-in
 *    serve + livereload instead.
 *  - Stylelint plugin – run as a separate lint step.
 *  - Statoscope analysis – webpack-only.
 */

require('dotenv').config();
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const { sassPlugin } = require('esbuild-sass-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('postcss');

const _ = require('lodash');
const facilitySidebar = require('@department-of-veterans-affairs/platform-landing-pages/facility-sidebar');

const ENVIRONMENTS = require('../src/site/constants/environments');
const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('./manifest-helpers');

const { VAGOVSTAGING, VAGOVPROD, LOCALHOST } = ENVIRONMENTS;

// ---------------------------------------------------------------------------
// Shared modules to split into a vendor chunk
// ---------------------------------------------------------------------------
// Shared modules reference (these get auto-extracted into shared chunks via ESM splitting)
// const sharedModules = ['react', 'react-dom', 'react-redux', 'redux', 'redux-thunk', '@sentry/browser'];

// ---------------------------------------------------------------------------
// Alias map — mirrors babel module-resolver config in babel.config.json
// ---------------------------------------------------------------------------
function buildAliasMap(rootDir) {
  // Read the babel.config.json to extract the module-resolver aliases
  const babelConfig = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'babel.config.json'), 'utf8'),
  );

  const moduleResolverPlugin = babelConfig.plugins.find(
    p => Array.isArray(p) && p[0] === 'module-resolver',
  );

  const babelAliases = moduleResolverPlugin
    ? moduleResolverPlugin[1].alias
    : {};
  const aliasMap = {};

  Object.entries(babelAliases).forEach(([key, value]) => {
    // Resolve relative paths from the root
    const resolved = value.startsWith('.')
      ? path.resolve(rootDir, value)
      : value;
    aliasMap[key] = resolved;
  });

  return aliasMap;
}

// ---------------------------------------------------------------------------
// esbuild alias plugin — resolves the extensive @department-of-veterans-affairs
// aliases and the ~, @@vap-svc, @@profile shortcuts.
// ---------------------------------------------------------------------------
const RESOLVE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const INDEX_FILES = ['index.js', 'index.jsx', 'index.ts', 'index.tsx'];

/**
 * Try to resolve a file path that might be a directory (needs /index.js)
 * or missing an extension.
 */
function resolveFileOrDir(filePath) {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }
  for (const ext of RESOLVE_EXTENSIONS) {
    const withExt = filePath + ext;
    if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) {
      return withExt;
    }
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    for (const idx of INDEX_FILES) {
      const p = path.join(filePath, idx);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

/**
 * Resolve a directory to its entry point via package.json or index file.
 */
function resolveDirEntry(dirPath) {
  const pkgPath = path.join(dirPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const entryFile = pkg.module || pkg.main || 'index.js';
    return path.resolve(dirPath, entryFile);
  }
  for (const idx of INDEX_FILES) {
    const p = path.join(dirPath, idx);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function aliasPlugin(aliasMap, rootDir) {
  return {
    name: 'va-alias-resolver',
    setup(build) {
      const sortedAliases = Object.entries(aliasMap).sort(
        (a, b) => b[0].length - a[0].length,
      );

      build.onResolve({ filter: /^[@~]/ }, args => {
        for (const [alias, target] of sortedAliases) {
          if (args.path === alias) {
            // Try resolving with extension/index fallback first
            const resolved = resolveFileOrDir(target);
            if (resolved) return { path: resolved };
            if (!fs.existsSync(target)) return undefined;
            if (fs.statSync(target).isDirectory()) {
              const entry = resolveDirEntry(target);
              if (entry) return { path: entry };
            }
            return { path: target };
          }
          if (args.path.startsWith(`${alias}/`)) {
            const rest = args.path.slice(alias.length);
            const resolved = resolveFileOrDir(`${target}${rest}`);
            if (resolved) return { path: resolved };
            // If target is a file (e.g. ui/index.js) and rest is /index,
            // the concatenation fails. Fall back to resolving target directly.
            const targetResolved = resolveFileOrDir(target);
            if (targetResolved) return { path: targetResolved };
            return undefined;
          }
        }
        return undefined;
      });

      const srcDir = path.join(rootDir, 'src');
      build.onResolve({ filter: /^(platform|applications|site)\// }, args => {
        const resolved = resolveFileOrDir(path.join(srcDir, args.path));
        return resolved ? { path: resolved } : undefined;
      });

      build.onResolve({ filter: /.*/ }, args => {
        if (args.namespace !== 'file' && args.namespace !== '')
          return undefined;
        if (!args.resolveDir) return undefined;

        // Don't intercept resolution within node_modules — let esbuild
        // handle it natively so that package.json "browser" field mappings
        // are respected (e.g. @mapbox/mapbox-sdk redirects node→browser).
        if (args.resolveDir.includes('node_modules')) return undefined;

        let candidate;
        if (path.isAbsolute(args.path)) {
          candidate = args.path;
        } else if (args.path.startsWith('.')) {
          candidate = path.resolve(args.resolveDir, args.path);
        } else {
          return undefined;
        }

        const resolved = resolveFileOrDir(candidate);
        return resolved ? { path: resolved } : undefined;
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin to null-out unwanted RJSF widgets (mirrors webpack null-loader rule)
// ---------------------------------------------------------------------------
function nullLoaderPlugin() {
  return {
    name: 'null-loader',
    setup(build) {
      const pattern = /react-jsonschema-form\/lib\/components\/(widgets|fields\/ObjectField|fields\/ArrayField)/;
      const exceptions = [/widgets\/index\.js/, /widgets\/TextareaWidget/];

      build.onResolve({ filter: pattern }, args => {
        const isException = exceptions.some(ex => ex.test(args.path));
        if (!isException) {
          return { path: args.path, namespace: 'null-loader' };
        }
        return undefined;
      });

      build.onLoad({ filter: /.*/, namespace: 'null-loader' }, () => ({
        contents: 'module.exports = {};',
        loader: 'js',
      }));
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin: generate file-manifest.json (matches WebpackManifestPlugin output)
// ---------------------------------------------------------------------------
function manifestPlugin() {
  return {
    name: 'manifest',
    setup(build) {
      build.onEnd(result => {
        if (!result.metafile) return;
        const manifest = {};
        Object.keys(result.metafile.outputs).forEach(outputPath => {
          const meta = result.metafile.outputs[outputPath];
          if (meta.entryPoint || outputPath.match(/\.entry\.(js|css)$/)) {
            const basename = path.basename(outputPath);
            manifest[basename] = basename;
          }
        });
        const outputDir = build.initialOptions.outdir;
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(
          path.join(outputDir, 'file-manifest.json'),
          JSON.stringify(manifest, null, 2),
        );
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin: post-build CSS minification with cssnano
// Runs on the final merged CSS files (after esbuild concatenates SCSS outputs).
// This is more effective than per-file minification because cssnano can
// deduplicate rules that appear across multiple @imported SCSS partials.
// ---------------------------------------------------------------------------
function cssMinifyPlugin() {
  return {
    name: 'css-minify',
    setup(build) {
      build.onEnd(async result => {
        if (!result.metafile) return;
        const processor = postcss([cssnano({ preset: 'default' })]);
        const cssFiles = Object.keys(result.metafile.outputs).filter(
          f => f.endsWith('.css') && !f.endsWith('.map'),
        );
        await Promise.all(
          cssFiles.map(async file => {
            const absPath = path.resolve(
              build.initialOptions.absWorkingDir || '.',
              file,
            );
            const source = fs.readFileSync(absPath, 'utf8');
            const minified = await processor.process(source, { from: absPath });
            fs.writeFileSync(absPath, minified.css);
          }),
        );
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin: copy static assets (mirrors CopyPlugin)
// ---------------------------------------------------------------------------
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// ---------------------------------------------------------------------------
// Plugin: copy static assets (mirrors CopyPlugin)
// ---------------------------------------------------------------------------
function copyAssetsPlugin(buildPath) {
  return {
    name: 'copy-assets',
    setup(build) {
      build.onEnd(() => {
        const copies = [
          { from: 'src/site/assets', to: buildPath },
          {
            from: 'src/platform/site-wide/sass/fonts',
            to: path.join(buildPath, 'generated'),
          },
          {
            from:
              'node_modules/@department-of-veterans-affairs/component-library/dist/img',
            to: path.join(buildPath, 'img'),
          },
        ];

        copies.forEach(({ from, to }) => {
          const src = path.resolve(
            build.initialOptions.absWorkingDir || '.',
            from,
          );
          if (fs.existsSync(src)) {
            copyDirSync(src, to);
          }
        });
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin: resolve ~package references in CSS url() (webpack sass-loader convention)
// ---------------------------------------------------------------------------
function tildeResolverPlugin() {
  return {
    name: 'tilde-resolver',
    setup(build) {
      // Handle ~package/path references from pre-compiled CSS in node_modules.
      // The ~ prefix means "resolve from node_modules" in webpack's sass-loader.
      build.onResolve({ filter: /^~/ }, args => {
        const stripped = args.path.slice(1); // remove ~
        const nodeModulesDir = path.resolve(
          build.initialOptions.absWorkingDir || '.',
          'node_modules',
        );
        const resolved = path.resolve(nodeModulesDir, stripped);
        if (fs.existsSync(resolved)) {
          return { path: resolved };
        }
        // Some packages (e.g. @uswds/uswds) reference assets at paths like
        // ~@uswds/uswds/fonts/... but the files actually live under dist/.
        // Try inserting /dist/ after the package name.
        const parts = stripped.split('/');
        const pkgStart = parts[0].startsWith('@') ? 2 : 1;
        const withDist = [
          ...parts.slice(0, pkgStart),
          'dist',
          ...parts.slice(pkgStart),
        ].join('/');
        const distResolved = path.resolve(nodeModulesDir, withDist);
        if (fs.existsSync(distResolved)) {
          return { path: distResolved };
        }
        return undefined;
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Node polyfill shims — mirrors webpack resolve.fallback
// ---------------------------------------------------------------------------
function nodePolyfillPlugin() {
  return {
    name: 'node-polyfills',
    setup(build) {
      // Provide empty modules for Node builtins and things we don't want in browser
      const emptyModules = [
        'crypto',
        'iconv-lite',
        'fs',
        'dns',
        'net',
        'tls',
        'http',
        'https',
        'http2',
        'os',
        'child_process',
      ];
      emptyModules.forEach(mod => {
        build.onResolve({ filter: new RegExp(`^${mod}$`) }, () => ({
          path: mod,
          namespace: 'empty-module',
        }));
      });

      build.onLoad({ filter: /.*/, namespace: 'empty-module' }, () => ({
        contents: 'module.exports = {};',
        loader: 'js',
      }));
    },
  };
}

// ---------------------------------------------------------------------------
// Lazy-load splitting: build heavy dependencies as separate on-demand bundles
// ---------------------------------------------------------------------------
//
// FUTURE: Auto-discover dynamic imports
// --------------------------------------
// Currently, lazy modules must be manually registered in LAZY_MODULES below.
// To match webpack's DX (where any import() "just works"), the plugin could
// be refactored to auto-discover all dynamic imports:
//
//   1. In lazyLoadPlugin(), intercept ALL onResolve calls with
//      kind === 'dynamic-import' (not just configured specifiers).
//   2. Resolve the real path, derive a deterministic bundle name from the
//      specifier (e.g. slugify('cheerio') → 'cheerio'), and emit the
//      script-tag loader as today.
//   3. Collect discovered imports in a shared Map (specifier → resolved path).
//   4. After the main build, buildLazyBundles() iterates the collected Map
//      instead of LAZY_MODULES — no manual config needed.
//
// The requireContextPlugin would still be needed for platform-pdf's
// webpack-specific require.context() call, but could be triggered by
// detecting the import specifier rather than hardcoding it.
// ---------------------------------------------------------------------------

/**
 * Modules that should be split into separate on-demand bundles.
 * Each key is the import specifier, value describes the bundle:
 *  - bundleName: output filename (without .entry.js)
 *  - globalKey: property name on window.__lazyBundles
 *  - entryPoint: the file to bundle
 */
const LAZY_MODULES = {
  '@department-of-veterans-affairs/platform-pdf/exports': {
    bundleName: 'platform-pdf',
    globalKey: 'platformPdf',
    entryPoint: require.resolve('@department-of-veterans-affairs/platform-pdf'),
  },
  cheerio: {
    bundleName: 'cheerio',
    globalKey: 'cheerio',
    entryPoint: require.resolve('cheerio'),
  },
};

/**
 * Plugin that intercepts dynamic import() calls for configured lazy modules
 * and replaces them with a runtime script loader. The lazy module is built
 * separately as an IIFE that registers its exports on window.__lazyBundles.
 */
function lazyLoadPlugin() {
  return {
    name: 'lazy-load',
    setup(build) {
      // For each lazy module, intercept its import resolution
      Object.entries(LAZY_MODULES).forEach(([specifier, info]) => {
        const filterRe = new RegExp(
          `^${specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        );

        // When this module is imported, redirect to a virtual namespace
        build.onResolve({ filter: filterRe }, args => {
          // Only intercept dynamic imports (import expressions).
          // Static imports use 'import-statement' or 'require-call'.
          if (args.kind !== 'dynamic-import') return undefined;
          return {
            path: `lazy:${info.globalKey}`,
            namespace: 'lazy-load',
          };
        });
      });

      // Return a runtime loader for the virtual module
      build.onLoad({ filter: /.*/, namespace: 'lazy-load' }, args => {
        const globalKey = args.path.replace('lazy:', '');
        const info = Object.values(LAZY_MODULES).find(
          m => m.globalKey === globalKey,
        );
        const scriptSrc = `/generated/${info.bundleName}.entry.js`;

        // The runtime code:
        // 1. Checks if the module is already loaded on window.__lazyBundles
        // 2. If not, creates a <script> tag and waits for it to load
        // 3. Resolves with the module's exports from window.__lazyBundles
        //
        // IMPORTANT: esbuild converts dynamic import() to
        //   Promise.resolve().then(() => __toESM(require_lazy_xxx()))
        // __toESM(obj) creates Object.create(getPrototypeOf(obj)).
        // If obj is a raw Promise, the target inherits Promise.prototype,
        // making it a broken thenable (has .then() but no internal slots).
        // Fix: export a plain { __esModule, then } object so __toESM
        // creates a target with Object.prototype that delegates .then()
        // to the real loading Promise.
        const contents = `
          var loaded = (window.__lazyBundles || {})[${JSON.stringify(
            globalKey,
          )}];
          if (loaded) {
            module.exports = loaded;
          } else {
            var p = new Promise(function(resolve, reject) {
              // Check again in case of race condition
              var existing = (window.__lazyBundles || {})[${JSON.stringify(
                globalKey,
              )}];
              if (existing) { module.exports = existing; resolve(existing); return; }
              var s = document.createElement('script');
              s.src = ${JSON.stringify(scriptSrc)};
              s.onload = function() {
                var mod = (window.__lazyBundles || {})[${JSON.stringify(
                  globalKey,
                )}];
                if (mod) { module.exports = mod; resolve(mod); }
                else reject(new Error('Lazy bundle ${globalKey} did not register on window.__lazyBundles'));
              };
              s.onerror = function() {
                reject(new Error('Failed to load lazy bundle: ${scriptSrc}'));
              };
              document.head.appendChild(s);
            });
            module.exports = { __esModule: true, then: function(a, b) { return p.then(a, b); } };
          }
        `;

        return { contents, loader: 'js' };
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin: replace webpack-only require.context in platform-pdf
// ---------------------------------------------------------------------------
// registerStaticFiles.js uses require.context('pdfkit/js/data', false,
// /Helvetica.*\.afm$/) which is webpack-only.  This plugin intercepts
// that file and replaces its contents with explicit requires for the
// four known Helvetica AFM files bundled with pdfkit.
function requireContextPlugin() {
  // Locate pdfkit's virtual-fs.js once (singleton in-memory filesystem).
  // Both registerStaticFiles.js and pdfkit.js itself do require('fs')
  // expecting this virtual-fs, but nodePolyfillPlugin stubs fs to {}.
  const platformPdfDir = path.dirname(
    require.resolve('@department-of-veterans-affairs/platform-pdf'),
  );
  const pdfkitVirtualFs = path.join(
    platformPdfDir,
    'node_modules/pdfkit/js/virtual-fs.js',
  );
  const pdfkitData = path.join(platformPdfDir, 'node_modules/pdfkit/js/data');

  return {
    name: 'require-context-polyfill',
    setup(build) {
      // Redirect require('fs') to pdfkit's virtual-fs for pdfkit,
      // fontkit, and platform-pdf files so they share the same
      // in-memory filesystem.  The alias plugin maps the package name
      // to src/platform/pdf so we match both path forms.
      const pdfkitScope = /platform-pdf|platform\/pdf|pdfkit|fontkit/;
      build.onResolve({ filter: /^fs$/ }, args => {
        if (args.importer && pdfkitScope.test(args.importer)) {
          return { path: pdfkitVirtualFs };
        }
        return undefined; // fall through to nodePolyfillPlugin
      });

      build.onLoad({ filter: /registerStaticFiles\.js$/ }, async args => {
        const src = await fs.promises.readFile(args.path, 'utf8');
        if (!src.includes('require.context')) return undefined;

        const files = fs
          .readdirSync(pdfkitData)
          .filter(f => /Helvetica.*\.afm$/.test(f));

        const requires = files
          .map(
            f =>
              `  "./${f}": require(${JSON.stringify(
                path.join(pdfkitData, f),
              )})`,
          )
          .join(',\n');

        // Use pdfkit's virtual-fs directly via absolute path so we
        // don't depend on the onResolve hook matching the importer.
        const replacement = `
var fs = require(${JSON.stringify(pdfkitVirtualFs)});
var _ctxMap = {\n${requires}\n};
function _ctx(key) { return _ctxMap[key]; }
_ctx.keys = function() { return Object.keys(_ctxMap); };
function registerAFMFonts(ctx) {
  ctx.keys().forEach(function(key) {
    var match = key.match(/([^/]*\\.afm$)/);
    if (match) { fs.writeFileSync("data/" + match[0], ctx(key)); }
  });
}
if (process.env.NODE_ENV !== 'test') { registerAFMFonts(_ctx); }
`;
        return {
          contents: replacement,
          loader: 'js',
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

/**
 * Build lazy bundles as separate IIFE files. Each bundle registers its
 * exports on window.__lazyBundles[key] so the runtime loader can find them.
 *
 * Called after the main build to produce companion bundles.
 */
async function buildLazyBundles(outdir, shouldMinify, rootDir, options = {}) {
  const entries = Object.entries(LAZY_MODULES);
  if (entries.length === 0) return;

  console.log(`  Building ${entries.length} lazy bundle(s)...`);

  const aliasMap = buildAliasMap(rootDir);

  // Reuse the process/Buffer shim files already created by buildConfig()
  const processShimFile = path.join(outdir, '_process-shim.js');
  const bufferShimFile = path.join(outdir, '_buffer-shim.js');

  for (const [, info] of entries) {
    const wrapperContents = `
      // Lazy bundle wrapper: registers exports on window.__lazyBundles
      var _mod = require(${JSON.stringify(info.entryPoint)});
      window.__lazyBundles = window.__lazyBundles || {};
      window.__lazyBundles[${JSON.stringify(info.globalKey)}] = _mod;
    `;

    const wrapperFile = path.join(outdir, `_lazy_${info.bundleName}_entry.js`);
    fs.writeFileSync(wrapperFile, wrapperContents);

    // eslint-disable-next-line no-await-in-loop
    await esbuild.build({
      entryPoints: { [`${info.bundleName}.entry`]: wrapperFile },
      bundle: true,
      outdir,
      format: 'iife',
      platform: 'browser',
      target: ['es2018', 'chrome67', 'firefox68', 'safari12', 'edge79'],
      minify: shouldMinify,
      sourcemap: true,
      metafile: true,
      absWorkingDir: rootDir,
      treeShaking: true,
      inject: [processShimFile, bufferShimFile],
      define: {
        __BUILDTYPE__: JSON.stringify(options.buildtype || 'localhost'),
        __API__: JSON.stringify(options.api || ''),
        'process.env.NODE_ENV': JSON.stringify(
          shouldMinify ? 'production' : 'development',
        ),
        global: 'window',
        __dirname: '""',
      },
      alias: {
        querystring: require.resolve('querystring-es3'),
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
        process: require.resolve('process/browser'),
        'process/browser': require.resolve('process/browser'),
      },
      loader: {
        '.js': 'jsx',
        '.afm': 'text',
      },
      resolveExtensions: [
        '.js',
        '.jsx',
        '.tsx',
        '.ts',
        '.json',
        '.scss',
        '.css',
      ],
      plugins: [
        aliasPlugin(aliasMap, rootDir),
        requireContextPlugin(),
        nodePolyfillPlugin(),
      ],
      external: ['/img/*', '/fonts/*', '/generated/*'],
    });

    // Clean up wrapper file
    fs.unlinkSync(wrapperFile);
    console.log(
      `    ✓ ${info.bundleName}.entry.js (${(
        fs.statSync(path.join(outdir, `${info.bundleName}.entry.js`)).size /
        1024
      ).toFixed(0)}K)`,
    );
  }
}

// ---------------------------------------------------------------------------
// Plugin: warn on large SVGs being inlined as data URIs
// ---------------------------------------------------------------------------
const SVG_SIZE_WARN_BYTES = 25 * 1024; // 25 KB

function svgSizeWarningPlugin() {
  return {
    name: 'svg-size-warning',
    setup(build) {
      build.onLoad({ filter: /\.svg$/ }, args => {
        const stats = fs.statSync(args.path);
        if (stats.size > SVG_SIZE_WARN_BYTES) {
          const sizeKB = (stats.size / 1024).toFixed(1);
          return {
            warnings: [
              {
                text: `SVG is ${sizeKB} KB (> ${SVG_SIZE_WARN_BYTES /
                  1024} KB) and will be inlined as a data URI. Consider optimizing or using a file reference instead.`,
                detail: args.path,
              },
            ],
          };
        }
        return undefined;
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------
function getEntryPoints(entry) {
  const allManifests = getAppManifests();
  let manifests = allManifests;

  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    if (!entryNames.includes('static-pages')) {
      entryNames.push('static-pages');
    }
    manifests = allManifests.filter(m => entryNames.includes(m.entryName));
  }

  return getWebpackEntryPoints(manifests);
}

// Global entries that always get built
function getGlobalEntries(rootDir) {
  return {
    polyfills: require.resolve(
      '@department-of-veterans-affairs/platform-polyfills/preESModulesPolyfills',
    ),
    style: require.resolve(
      '@department-of-veterans-affairs/platform-site-wide/style',
    ),
    'va-medallia-styles': require.resolve(
      '@department-of-veterans-affairs/platform-site-wide/va-medallia-style',
    ),
    styleConsolidated: path.resolve(
      rootDir,
      'src/applications/proxy-rewrite/sass/style-consolidated.scss',
    ),
  };
}

// ---------------------------------------------------------------------------
// Main config builder
// ---------------------------------------------------------------------------
async function buildConfig(options = {}) {
  const rootDir = path.resolve(__dirname, '..');
  const { buildtype = LOCALHOST, entry, minify: minifyOverride } = options;

  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(buildtype);
  const shouldMinify =
    minifyOverride !== undefined ? minifyOverride : isOptimizedBuild;

  const buildPath = path.resolve(
    rootDir,
    'build',
    options.destination || buildtype,
  );
  const outdir = path.join(buildPath, 'generated');

  // Load app registry for DefinePlugin equivalent
  let appRegistry = [];
  try {
    appRegistry = JSON.parse(
      fs.readFileSync(
        path.join(rootDir, 'src/applications/registry.json'),
        'utf8',
      ),
    );
  } catch {
    // registry.json may not exist in all environments
  }

  // envBucketUrl available for sourcemap URL suffix in production
  // const envBucketUrl = BUCKETS[buildtype] || '';

  const appEntries = getEntryPoints(entry);
  const globalEntries = getGlobalEntries(rootDir);
  const allEntries = { ...appEntries, ...globalEntries };

  // Convert to esbuild entryPoints format
  const entryPoints = Object.entries(allEntries).reduce(
    (acc, [name, filePath]) => {
      acc[`${name}.entry`] = filePath;
      return acc;
    },
    {},
  );

  // IIFE format: each entry is self-contained with all dependencies
  // inlined. This matches webpack's output model and works with HTTP/1
  // serving on S3. Shared modules (react, etc.) are duplicated across
  // entries but tree-shaking keeps each bundle lean.

  const aliasMap = buildAliasMap(rootDir);

  // Create process and Buffer shim files — these inject the browser
  // polyfills as globals so that node_modules packages (util, readable-
  // stream, etc.) that reference bare `process` or `Buffer` work in the
  // browser.  Without these, the IIFE crashes with ReferenceError.
  fs.mkdirSync(outdir, { recursive: true });
  const processShimFile = path.join(outdir, '_process-shim.js');
  fs.writeFileSync(
    processShimFile,
    `import process from ${JSON.stringify(
      require.resolve('process/browser'),
    )};\nexport { process };\n`,
  );
  const bufferShimFile = path.join(outdir, '_buffer-shim.js');
  fs.writeFileSync(
    bufferShimFile,
    `import { Buffer } from ${JSON.stringify(
      require.resolve('buffer/'),
    )};\nexport { Buffer };\n`,
  );

  const config = {
    entryPoints,
    bundle: true,
    outdir,
    format: 'iife',
    platform: 'browser',
    // Note: esbuild handles syntax transforms differently from babel.
    // We target es2018 to support destructuring/rest/spread in node_modules.
    // The runtime polyfills from @babel/env are not needed since esbuild
    // handles syntax transforms natively.
    target: ['es2018', 'chrome67', 'firefox68', 'safari12', 'edge79'],
    minify: shouldMinify,
    sourcemap: true,
    metafile: true,
    logLevel: 'info',
    absWorkingDir: rootDir,
    splitting: false,
    treeShaking: true,

    // Match webpack output naming
    entryNames: '[name]',
    assetNames: '[name]-[hash]',

    // Loaders for asset types
    // SVGs are small UI icons — inline them as data URIs to avoid extra
    // HTTP requests. Other images and fonts are emitted as files.
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'dataurl',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file',
      '.afm': 'text',
    },

    // DefinePlugin equivalent
    define: {
      __BUILDTYPE__: JSON.stringify(buildtype),
      __API__: JSON.stringify(options.api || ''),
      __REGISTRY__: JSON.stringify(appRegistry),
      'process.env.NODE_ENV': JSON.stringify(
        isOptimizedBuild ? 'production' : 'development',
      ),
      'process.env.MAPBOX_TOKEN': JSON.stringify(
        process.env.MAPBOX_TOKEN || '',
      ),
      'process.env.USE_LOCAL_DIRECTLINE': JSON.stringify(
        process.env.USE_LOCAL_DIRECTLINE || false,
      ),
      'process.env.USE_MOCKS': JSON.stringify(process.env.USE_MOCKS || ''),
      'process.env.HOST_NAME': JSON.stringify(process.env.HOST_NAME || ''),
      'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || 'info'),
      'process.env.DATADOG_TAGS': JSON.stringify(
        process.env.DATADOG_TAGS || '',
      ),
      global: 'window',
      __dirname: '""',
    },

    // Inject process and Buffer browser polyfills as globals
    inject: [processShimFile, bufferShimFile],

    // Resolve configuration
    resolveExtensions: ['.js', '.jsx', '.tsx', '.ts', '.json', '.scss', '.css'],

    // Node built-in polyfills
    alias: {
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      'process/browser': require.resolve('process/browser'),
      // fs is handled by the nodePolyfillPlugin as an empty module

      // These packages have broken exports maps (main/require point to
      // non-existent lib/ dirs). Alias to their actual dist files.
      'p-defer-es5': path.resolve(
        rootDir,
        'node_modules/p-defer-es5/dist/p-defer-es5.production.min.js',
      ),
      'markdown-it-attrs-es5': path.resolve(
        rootDir,
        'node_modules/markdown-it-attrs-es5/dist/markdown-it-attrs-es5.production.min.js',
      ),
      'abort-controller-es5': path.resolve(
        rootDir,
        'node_modules/abort-controller-es5/dist/abort-controller-es5.production.min.js',
      ),
    },

    plugins: [
      // Force bare 'date-fns' imports to the ESM entry. Without this,
      // CJS require('date-fns') from va-forms-system-core causes esbuild
      // to use the CJS barrel with lazy __commonJS init wrappers.  That
      // breaks top-level calls like `formatDateLong(new Date())` because
      // the init hasn't run yet when the function executes.  Subpath
      // imports like 'date-fns/_lib/...' are left alone.
      {
        name: 'date-fns-esm',
        setup(build) {
          build.onResolve({ filter: /^date-fns$/ }, () => ({
            path: path.resolve(rootDir, 'node_modules/date-fns/esm/index.js'),
          }));
        },
      },
      lazyLoadPlugin(),
      aliasPlugin(aliasMap, rootDir),
      requireContextPlugin(),
      nullLoaderPlugin(),
      nodePolyfillPlugin(),
      svgSizeWarningPlugin(),
      tildeResolverPlugin(),
      sassPlugin({
        async transform(source) {
          const { css } = await postcss([autoprefixer]).process(source, {
            from: undefined,
          });
          return css;
        },
        // Resolve ~package and aliased imports in SCSS
        importMapper: importPath => {
          const stripped = importPath.replace(/^~/, '');
          // Check if the import matches an alias
          for (const [alias, target] of Object.entries(aliasMap).sort(
            (a, b) => b[0].length - a[0].length,
          )) {
            if (stripped === alias) {
              return target;
            }
            if (stripped.startsWith(`${alias}/`)) {
              const rest = stripped.slice(alias.length);
              return `${target}${rest}`;
            }
          }
          return stripped;
        },
        loadPaths: [rootDir, path.join(rootDir, 'node_modules')],
        // Handle ~package url() references in SCSS
        precompile(source) {
          // Replace ALL ~ references to node_modules packages in SCSS source.
          // This handles:
          // - url(~package/path) -> url(node_modules/package/path)
          // - $var: "~package/path" -> $var: "node_modules/package/path"
          // - @import "~package/path" -> @import "package/path"
          // The ~ prefix is a webpack sass-loader convention for node_modules.
          return source.replace(
            /(['"]?)~([@a-zA-Z])/g,
            (match, quote, firstChar) => `${quote}${firstChar}`,
          );
        },
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'if-function',
          'slash-div',
          'global-builtin',
          'color-functions',
        ],
      }),
      copyAssetsPlugin(buildPath),
      manifestPlugin(),
      ...(shouldMinify ? [cssMinifyPlugin()] : []),
    ],

    // Treat these as external to avoid bundling issues with dynamic requires
    // Mark absolute URL references in CSS (e.g., /img/..., /fonts/...) as external
    // Also mark ~@uswds font references as external (pre-compiled CSS from css-library)
    external: ['/img/*', '/fonts/*', '/generated/*'],
  };

  return { config, buildPath, outdir, processShimFile, bufferShimFile };
}

// ---------------------------------------------------------------------------
// Web-components ESM build with code splitting
// ---------------------------------------------------------------------------
//
// The VA Design System web components use Stencil's lazy-loading architecture.
// The ESM loader (dist/esm/loader.js) calls import() for each component
// (e.g. import('./va-alert.entry.js')).  With format:'iife' + splitting:false,
// esbuild inlines ALL 64 components into a single 2.7MB file.
//
// By building web-components as a separate ESM pass with splitting:true,
// esbuild preserves the dynamic imports and produces:
//   - A small web-components.entry.js (~50KB) with the Stencil runtime
//   - ~64 chunk files loaded on demand as components appear in the DOM
//
// This matches webpack's output where the web-components entry is ~341KB
// and 70 separate chunk files are loaded lazily.
// ---------------------------------------------------------------------------

/**
 * Build the web-components entry as an ESM bundle with code splitting.
 * Must be called after the main IIFE build so that the outdir exists.
 */
async function buildWebComponents(outdir, shouldMinify, rootDir, options = {}) {
  const aliasMap = buildAliasMap(rootDir);

  const wcEntry = require.resolve(
    '@department-of-veterans-affairs/platform-site-wide/wc-loader',
  );

  console.log('  Building web-components (ESM with splitting)...');

  await esbuild.build({
    entryPoints: { 'web-components.entry': wcEntry },
    bundle: true,
    outdir,
    format: 'esm',
    splitting: true,
    chunkNames: 'wc-chunks/[name]-[hash]',
    platform: 'browser',
    target: ['es2018', 'chrome67', 'firefox68', 'safari12', 'edge79'],
    minify: shouldMinify,
    sourcemap: true,
    metafile: true,
    absWorkingDir: rootDir,
    treeShaking: true,
    define: {
      __BUILDTYPE__: JSON.stringify(options.buildtype || 'localhost'),
      __API__: JSON.stringify(options.api || ''),
      'process.env.NODE_ENV': JSON.stringify(
        shouldMinify ? 'production' : 'development',
      ),
      global: 'window',
      __dirname: '""',
    },
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx',
      '.svg': 'dataurl',
    },
    resolveExtensions: ['.js', '.jsx', '.tsx', '.ts', '.json', '.scss', '.css'],
    alias: {
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      'process/browser': require.resolve('process/browser'),
    },
    plugins: [aliasPlugin(aliasMap, rootDir), nodePolyfillPlugin()],
    external: ['/img/*', '/fonts/*', '/generated/*'],
  });

  const wcSize = (
    fs.statSync(path.join(outdir, 'web-components.entry.js')).size / 1024
  ).toFixed(0);
  const chunkDir = path.join(outdir, 'wc-chunks');
  let chunkCount = 0;
  if (fs.existsSync(chunkDir)) {
    chunkCount = fs
      .readdirSync(chunkDir)
      .filter(f => f.endsWith('.js') && !f.endsWith('.js.map')).length;
  }
  console.log(
    `    \u2713 web-components.entry.js (${wcSize}K) + ${chunkCount} lazy chunks`,
  );
}

// ---------------------------------------------------------------------------
// Scaffold HTML generation
// ---------------------------------------------------------------------------

/**
 * Generate HTML scaffold pages for each app route.
 *
 * These are the index.html files that the test server (and in the future
 * the production CDN) needs to serve SPA routes.  The logic mirrors what
 * webpack's HtmlWebpackPlugin + dev-template.ejs does and is also
 * consistent with the on-the-fly scaffold in esbuild-watch.js.
 */
function generateScaffoldPages(buildPath) {
  const rootDir = path.resolve(__dirname, '..');

  // Load dev template
  const devTemplatePath = path.join(
    rootDir,
    'node_modules/@department-of-veterans-affairs/platform-landing-pages/dev-template.ejs',
  );
  const devTemplateSource = fs.readFileSync(devTemplatePath, 'utf8');
  // Use an explicit interpolate regex so lodash does NOT also process ES6
  // template-literal syntax (${...}).  The dev-template.ejs contains JS
  // template literals like `/${path}` inside <script> tags that are meant to
  // run in the browser, not be evaluated at compile time.
  const devTemplate = _.template(devTemplateSource, {
    interpolate: /<%=([\s\S]+?)%>/g,
  });

  // Load header/footer data and scaffold registry
  const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json'); // eslint-disable-line global-require
  const scaffoldRegistry = require('../src/applications/registry.scaffold.json'); // eslint-disable-line global-require

  // Load inline script assets from content-build (same approach as esbuild-watch.js)
  const contentBuildRoot = path.resolve(rootDir, '../content-build');
  const inlineScripts = {};
  for (const filename of ['record-event.js', 'static-page-widgets.js']) {
    const localPath = path.join(
      contentBuildRoot,
      'src/site/assets/js',
      filename,
    );
    if (fs.existsSync(localPath)) {
      inlineScripts[filename] = fs.readFileSync(localPath, 'utf8');
    } else {
      inlineScripts[filename] = '// content-build asset not available';
    }
  }

  // Load content-build app registry (has template.title overrides, e.g.
  // Dashboard app uses template.title "My VA").  Mirrors webpack's loadAsset
  // approach: try local content-build first, then download from GitHub.
  let contentBuildRegistry = [];
  const cbRegistryPath = path.join(
    contentBuildRoot,
    'src/applications/registry.json',
  );
  if (fs.existsSync(cbRegistryPath)) {
    try {
      contentBuildRegistry = JSON.parse(
        fs.readFileSync(cbRegistryPath, 'utf8'),
      );
    } catch {
      // ignore parse errors
    }
  } else {
    // Download from content-build repo (matches webpack fallback behavior)
    try {
      const registryUrl =
        'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/main/src/applications/registry.json';
      const result = require('child_process') // eslint-disable-line global-require
        .execSync(`curl -sf "${registryUrl}"`, {
          encoding: 'utf8',
          timeout: 10000,
        });
      contentBuildRegistry = JSON.parse(result);
    } catch {
      // Content-build registry unavailable — titles will fall back to appName
    }
  }

  // Combine scaffold + content-build registries for template lookups
  const combinedRegistry = [...scaffoldRegistry, ...contentBuildRegistry];

  // Build app routes from manifests + scaffold registry (mirrors webpack's
  // [...appRegistry, ...scaffoldRegistry] approach)
  const manifests = getAppManifests();
  const manifestMap = new Map();
  for (const m of manifests) {
    if (m.rootUrl) {
      manifestMap.set(m.rootUrl, m);
    }
  }

  // Start with manifest entries, enriched with scaffold/content-build metadata
  const appRoutes = manifests.filter(m => m.rootUrl).map(m => {
    const registryEntry = combinedRegistry.find(s => s.rootUrl === m.rootUrl);
    return {
      rootUrl: m.rootUrl,
      entryName: m.entryName,
      appName: m.appName,
      widgetType: registryEntry?.widgetType,
      widgetTemplate: registryEntry?.widgetTemplate,
      template: registryEntry?.template || {},
    };
  });

  // Add scaffold-only entries (like rootUrl "/") that have no matching manifest.
  // These default to the 'static-pages' entry, matching webpack's behavior.
  for (const entry of scaffoldRegistry) {
    if (entry.rootUrl && !manifestMap.has(entry.rootUrl)) {
      appRoutes.push({
        rootUrl: entry.rootUrl,
        entryName: entry.entryName || 'static-pages',
        appName: entry.appName || '',
        widgetType: entry.widgetType,
        widgetTemplate: entry.widgetTemplate,
        template: entry.template || {},
      });
    }
  }

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

    return [...styleTags, ...scriptTags]
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

  let count = 0;
  for (const appRoute of appRoutes) {
    const {
      entryName,
      appName,
      widgetType,
      widgetTemplate,
      template,
    } = appRoute;

    const headTags = [
      {
        attributes: {
          href: '/generated/style.entry.css',
          rel: 'stylesheet',
        },
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
      {
        attributes: { src: '/generated/polyfills.entry.js', defer: true },
        tagName: 'script',
      },
      {
        attributes: {
          src: '/generated/web-components.entry.js',
          type: 'module',
        },
        tagName: 'script',
      },
      {
        attributes: {
          src: `/generated/${entryName}.entry.js`,
          type: 'module',
        },
        tagName: 'script',
      },
    ];

    let title = 'VA.gov Home | Veterans Affairs';
    if (template && template.title) {
      title = `${template.title} | Veterans Affairs`;
    } else if (appName) {
      title = `${appName} | Veterans Affairs`;
    }

    let html;
    try {
      html = devTemplate({
        htmlWebpackPlugin: {
          options: { title },
          tags: { headTags },
        },
        headerFooterData,
        facilitySidebar,
        loadInlineScript: filename => inlineScripts[filename] || '',
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
    } catch (err) {
      // Fallback to minimal HTML if template rendering fails
      console.warn(
        `  ⚠ Template failed for ${appRoute.rootUrl}: ${err.message}`,
      );
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${_.escape(title)}</title>
  <link rel="stylesheet" href="/generated/style.entry.css">
  <link rel="stylesheet" href="/generated/web-components.entry.css">
  <link rel="stylesheet" href="/generated/${_.escape(entryName)}.entry.css">
</head>
<body class="merger">
  <div id="content"><div id="react-root"></div></div>
  <div id="footerNav"></div>
  <script defer src="/generated/polyfills.entry.js"></script>
  <script type="module" src="/generated/web-components.entry.js"></script>
  <script type="module" src="/generated/${_.escape(
    entryName,
  )}.entry.js"></script>
</body>
</html>`;
    }

    const htmlDir = path.join(buildPath, appRoute.rootUrl);
    fs.mkdirSync(htmlDir, { recursive: true });
    fs.writeFileSync(path.join(htmlDir, 'index.html'), html);
    count += 1;
  }

  console.log(`  Generated ${count} scaffold HTML pages`);

  // Write a root index.html so the test-server health check (GET /) returns 200
  const rootIndexPath = path.join(buildPath, 'index.html');
  if (!fs.existsSync(rootIndexPath)) {
    fs.writeFileSync(
      rootIndexPath,
      '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/"></head><body></body></html>',
    );
  }
}

// ---------------------------------------------------------------------------
// Build runner
// ---------------------------------------------------------------------------

async function runBuild(options = {}) {
  const {
    config,
    buildPath,
    outdir,
    processShimFile,
    bufferShimFile,
  } = await buildConfig(options);

  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(
    options.buildtype,
  );
  const shouldMinify =
    options.minify !== undefined ? options.minify : isOptimizedBuild;
  const rootDir = path.resolve(__dirname, '..');

  console.log(`\n  esbuild: Building to ${buildPath}`);
  console.log(`  buildtype: ${options.buildtype || LOCALHOST}`);
  console.log(`  entries: ${Object.keys(config.entryPoints).length}\n`);

  const startTime = Date.now();

  // IIFE mode: each entry is self-contained, no shared chunks.
  const result = await esbuild.build(config);

  // Build web-components as ESM with code splitting (lazy-loaded chunks)
  await buildWebComponents(outdir, shouldMinify, rootDir, options);

  // Build lazy bundles (platform-pdf, cheerio, etc.)
  await buildLazyBundles(outdir, shouldMinify, rootDir, options);

  // Clean up shim files used by inject
  try {
    fs.unlinkSync(processShimFile);
  } catch {
    /* already gone */
  }
  try {
    fs.unlinkSync(bufferShimFile);
  } catch {
    /* already gone */
  }

  // Generate scaffold HTML pages so that the test-server (and any
  // static-file server) can serve SPA routes at /{rootUrl}/index.html.
  generateScaffoldPages(buildPath);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n  Build completed in ${elapsed}s`);

  // Write metafile for analysis
  if (result.metafile) {
    fs.writeFileSync(
      path.join(outdir, 'esbuild-meta.json'),
      JSON.stringify(result.metafile),
    );
  }

  if (result.errors.length > 0) {
    console.error('Build errors:', result.errors);
    process.exit(1);
  }

  // IIFE mode: each entry is self-contained, no shared chunks.
  // Scripts are loaded with defer attribute in HTML templates.

  return result;
}

module.exports = {
  buildConfig,
  runBuild,
  getEntryPoints,
  buildAliasMap,
  buildLazyBundles,
  buildWebComponents,
  generateScaffoldPages,
  LAZY_MODULES,
};
