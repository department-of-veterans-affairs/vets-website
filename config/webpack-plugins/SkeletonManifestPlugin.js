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
                // For now, create a simple placeholder skeleton
                // In production, this would be generated from the actual component
                const placeholderHTML = `
                  <div class="medications-refills-skeleton" data-skeleton="true">
                    <div class="vads-l-grid-container vads-u-padding-x--0 large-screen:vads-u-padding-x--2">
                      <div class="vads-l-row">
                        <div class="vads-l-col--12">
                          <div class="skeleton-shimmer" style="width: 280px; height: 36px; margin-top: 2rem; margin-bottom: 1rem;" aria-hidden="true"></div>
                          <div class="skeleton-shimmer" style="width: 100%; max-width: 600px; height: 20px; margin-bottom: 2rem;" aria-hidden="true"></div>
                          <div class="skeleton-card" style="margin-bottom: 1rem; padding: 1.5rem; background-color: #f0f0f0; border-radius: 4px;">
                            <div class="skeleton-shimmer" style="width: 220px; height: 24px; margin-bottom: 1rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 200px; height: 16px; margin-bottom: 0.5rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 180px; height: 16px;" aria-hidden="true"></div>
                          </div>
                          <div class="skeleton-card" style="margin-bottom: 1rem; padding: 1.5rem; background-color: #f0f0f0; border-radius: 4px;">
                            <div class="skeleton-shimmer" style="width: 220px; height: 24px; margin-bottom: 1rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 200px; height: 16px; margin-bottom: 0.5rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 180px; height: 16px;" aria-hidden="true"></div>
                          </div>
                          <div class="skeleton-card" style="margin-bottom: 1rem; padding: 1.5rem; background-color: #f0f0f0; border-radius: 4px;">
                            <div class="skeleton-shimmer" style="width: 220px; height: 24px; margin-bottom: 1rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 200px; height: 16px; margin-bottom: 0.5rem;" aria-hidden="true"></div>
                            <div class="skeleton-shimmer" style="width: 180px; height: 16px;" aria-hidden="true"></div>
                          </div>
                          <div class="skeleton-shimmer" style="width: 160px; height: 44px; margin-top: 2rem;" aria-hidden="true"></div>
                          <div class="sr-only">Loading prescription refills...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `.trim();

                skeletons[manifest.entryName] = {
                  html: placeholderHTML,
                  rootUrl: manifest.rootUrl,
                };

                console.log(
                  `[SkeletonManifestPlugin] ✓ Generated skeleton for ${
                    manifest.entryName
                  }`,
                );
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
