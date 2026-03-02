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
    'web-components': require.resolve(
      '@department-of-veterans-affairs/platform-site-wide/wc-loader',
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
    // Use 'file' for images and SVGs so they're emitted as separate files
    // (matching webpack's url-loader with size limits). Using 'dataurl'
    // for all images bloats CSS output with large base64-encoded data URIs.
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'file',
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
    },

    // Inject Buffer and process polyfills
    inject: [],

    // Resolve configuration
    resolveExtensions: ['.js', '.jsx', '.tsx', '.ts', '.json', '.scss', '.css'],

    // Node built-in polyfills
    alias: {
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('readable-stream'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      'process/browser': require.resolve('process/browser'),
      // fs is handled by the nodePolyfillPlugin as an empty module
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
      aliasPlugin(aliasMap, rootDir),
      nullLoaderPlugin(),
      nodePolyfillPlugin(),
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

  return { config, buildPath, outdir };
}

// ---------------------------------------------------------------------------\n// Build runner\n// ---------------------------------------------------------------------------

async function runBuild(options = {}) {
  const { config, buildPath, outdir } = await buildConfig(options);

  console.log(`\n  esbuild: Building to ${buildPath}`);
  console.log(`  buildtype: ${options.buildtype || LOCALHOST}`);
  console.log(`  entries: ${Object.keys(config.entryPoints).length}\n`);

  const startTime = Date.now();

  // IIFE mode: each entry is self-contained, no shared chunks.
  const result = await esbuild.build(config);
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

module.exports = { buildConfig, runBuild, getEntryPoints, buildAliasMap };
