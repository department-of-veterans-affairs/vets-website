/**
 * Webpack plugin that injects skeleton HTML into generated HTML files after compilation.
 * This runs after SkeletonManifestPlugin has generated the skeleton-manifest.json,
 * allowing us to inject the skeleton HTML into the app's index.html files.
 */

const fs = require('fs');
const path = require('path');

class SkeletonInjectorPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'SkeletonInjectorPlugin',
      (compilation, callback) => {
        try {
          // Read skeleton manifest
          const outputPath = compilation.outputOptions.path;
          const buildRoot = path.dirname(outputPath);
          const skeletonManifestPath = path.join(
            buildRoot,
            'generated',
            'skeleton-manifest.json',
          );

          if (!fs.existsSync(skeletonManifestPath)) {
            // No skeleton manifest, skip injection
            callback();
            return;
          }

          const skeletonManifest = JSON.parse(
            fs.readFileSync(skeletonManifestPath, 'utf8'),
          );

          // Find all HTML files in the build output
          let injectCount = 0;
          Object.keys(skeletonManifest).forEach(entryName => {
            const { html: skeletonHTML, rootUrl } = skeletonManifest[entryName];

            // Construct the path to the HTML file
            const htmlPath = path.join(
              buildRoot,
              rootUrl.startsWith('/') ? rootUrl.substring(1) : rootUrl,
              'index.html',
            );

            if (fs.existsSync(htmlPath)) {
              let htmlContent = fs.readFileSync(htmlPath, 'utf8');

              // Replace everything inside react-root with skeleton HTML
              // Need to match nested divs, so we find the opening and closing tags
              const reactRootStart = htmlContent.indexOf(
                '<div id="react-root">',
              );
              const reactRootEnd = htmlContent.indexOf(
                '</div>',
                reactRootStart,
              );

              if (reactRootStart !== -1 && reactRootEnd !== -1) {
                // Find the actual closing tag by counting nested divs
                let depth = 1;
                let pos = reactRootStart + '<div id="react-root">'.length;
                while (depth > 0 && pos < htmlContent.length) {
                  const nextOpen = htmlContent.indexOf('<div', pos);
                  const nextClose = htmlContent.indexOf('</div>', pos);

                  if (nextClose === -1) break;

                  if (nextOpen !== -1 && nextOpen < nextClose) {
                    depth += 1;
                    pos = nextOpen + 4;
                  } else {
                    depth -= 1;
                    if (depth === 0) {
                      // Found the matching closing tag
                      const before = htmlContent.substring(
                        0,
                        reactRootStart + '<div id="react-root">'.length,
                      );
                      const after = htmlContent.substring(nextClose);
                      htmlContent = `${before}\n              ${skeletonHTML}\n            ${after}`;
                      fs.writeFileSync(htmlPath, htmlContent, 'utf8');
                      injectCount += 1;
                      // eslint-disable-next-line no-console
                      console.log(
                        `[SkeletonInjectorPlugin] ✓ Injected skeleton for ${entryName}`,
                      );
                      break;
                    }
                    pos = nextClose + 6;
                  }
                }
              }
            }
          });

          if (injectCount > 0) {
            // eslint-disable-next-line no-console
            console.log(
              `[SkeletonInjectorPlugin] ✓ Total injections: ${injectCount}`,
            );
          }

          callback();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[SkeletonInjectorPlugin] Error:', error);
          callback(error);
        }
      },
    );
  }
}

module.exports = SkeletonInjectorPlugin;
