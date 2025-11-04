/* eslint-disable no-console, class-methods-use-this */
const fs = require('fs');
const path = require('path');

/**
 * Webpack plugin to generate skeleton manifest from app manifest files
 *
 * NOTE: This simplified version creates a placeholder skeleton manifest.
 * For actual skeleton HTML generation, we need a separate build process
 * that runs after webpack compilation, or use a server-side rendering approach.
 *
 * For now, we'll create the manifest structure with placeholder HTML
 * that can be replaced with actual skeleton HTML in a post-build step.
 */
class SkeletonManifestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'SkeletonManifestPlugin',
      (compilation, callback) => {
        try {
          const skeletons = {};
          const srcPath = path.resolve(__dirname, '../../src/applications');

          /**
           * Recursively find all manifest.json files in the applications directory
           */
          const findManifests = dir => {
            const manifests = [];
            const items = fs.readdirSync(dir, { withFileTypes: true });

            for (const item of items) {
              const fullPath = path.join(dir, item.name);
              if (item.isDirectory()) {
                manifests.push(...findManifests(fullPath));
              } else if (item.name === 'manifest.json') {
                manifests.push(fullPath);
              }
            }
            return manifests;
          };

          const manifestPaths = findManifests(srcPath);
          console.log(
            `\n[SkeletonManifestPlugin] Found ${
              manifestPaths.length
            } app manifests`,
          );

          // Process each manifest
          for (const manifestPath of manifestPaths) {
            try {
              const manifest = JSON.parse(
                fs.readFileSync(manifestPath, 'utf8'),
              );

              if (manifest.skeletonComponent) {
                // Render the actual skeleton component to HTML
                const appDir = path.dirname(manifestPath);
                const skeletonPath = path.resolve(
                  appDir,
                  manifest.skeletonComponent,
                );

                let skeletonHTML = '';

                try {
                  // Use Babel to transpile and React to render
                  const React = require('react');
                  const ReactDOMServer = require('react-dom/server');
                  const babel = require('@babel/core');

                  console.log(
                    `[SkeletonManifestPlugin] Attempting to load skeleton from: ${skeletonPath}`,
                  );

                  // Read and transpile the skeleton component file
                  const skeletonSource = fs.readFileSync(skeletonPath, 'utf8');
                  console.log(
                    `[SkeletonManifestPlugin] Source has nav: ${skeletonSource.includes(
                      '<nav',
                    )}`,
                  );
                  console.log(
                    `[SkeletonManifestPlugin] Source line 11-15: ${skeletonSource
                      .split('\n')
                      .slice(10, 15)
                      .join('\n')}`,
                  );
                  const transpiled = babel.transformSync(skeletonSource, {
                    filename: skeletonPath,
                    presets: [
                      '@babel/preset-react',
                      [
                        '@babel/preset-env',
                        {
                          targets: { node: 'current' },
                        },
                      ],
                    ],
                  });

                  // Create a module and evaluate the transpiled code
                  const Module = require('module');
                  const m = new Module();
                  m.require = require; // Provide require to the module
                  m.exports = {};

                  // Provide React in the module's require context
                  const originalRequire = m.require;
                  m.require = function(id) {
                    if (id === 'react') {
                      return React;
                    }
                    return originalRequire(id);
                  };

                  m._compile(transpiled.code, skeletonPath);
                  const SkeletonComponent = m.exports.default || m.exports;

                  console.log(
                    `[SkeletonManifestPlugin] Component loaded, rendering...`,
                  );

                  // Render the component WITHOUT App wrapper since the skeleton
                  // should be the raw component content
                  const element = React.createElement(SkeletonComponent);
                  skeletonHTML = ReactDOMServer.renderToStaticMarkup(element);

                  console.log(
                    `[SkeletonManifestPlugin] First 300 chars: ${skeletonHTML.substring(
                      0,
                      300,
                    )}`,
                  );

                  console.log(
                    `[SkeletonManifestPlugin] ✓ Rendered skeleton for ${
                      manifest.entryName
                    } (${skeletonHTML.length} bytes)`,
                  );
                } catch (error) {
                  console.error(
                    `[SkeletonManifestPlugin] Error rendering skeleton for ${
                      manifest.entryName
                    }:`,
                  );
                  console.error(`  Path: ${skeletonPath}`);
                  console.error(`  Error: ${error.message}`);
                  console.error(`  Stack: ${error.stack}`);
                  // Fallback to empty skeleton
                  skeletonHTML =
                    '<div class="skeleton-loading">Loading...</div>';
                }

                skeletons[manifest.entryName] = {
                  html: skeletonHTML,
                  rootUrl: manifest.rootUrl,
                };
              }
            } catch (error) {
              console.error(
                `[SkeletonManifestPlugin] Error processing ${manifestPath}:`,
                error.message,
              );
            }
          }

          // Write skeleton-manifest.json to build output
          const outputPath = path.resolve(
            compiler.options.output.path,
            '../generated/skeleton-manifest.json',
          );

          // Ensure directory exists
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });

          // Write the manifest file
          fs.writeFileSync(
            outputPath,
            JSON.stringify(skeletons, null, 2),
            'utf8',
          );

          const entryCount = Object.keys(skeletons).length;
          console.log(
            `\n[SkeletonManifestPlugin] ✓ Skeleton manifest generated: ${outputPath}`,
          );
          console.log(
            `[SkeletonManifestPlugin] ✓ Total skeletons: ${entryCount}\n`,
          );

          callback();
        } catch (error) {
          console.error('[SkeletonManifestPlugin] Fatal error:', error);
          callback(error);
        }
      },
    );
  }
}

module.exports = SkeletonManifestPlugin;
