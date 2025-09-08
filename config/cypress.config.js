const { defineConfig } = require('cypress');
const path = require('path');

function ghAnnotate({ file, title, message, line = 1 }) {
  const esc = s =>
    String(s)
      .replace(/%/g, '%25')
      .replace(/\r/g, '%0D')
      .replace(/\n/g, '%0A');
  process.stdout.write(
    `::warning file=${esc(file)},line=${line},title=${esc(title)}::${esc(
      message,
    )}\n`,
  );
}
const touchedSpecs = new Set();

const dynamicBaseUrl =
  process.env.CYPRESS_BASE_URL ||
  (process.env.CI ? 'http://localhost:3001' : undefined);

const cypressConfig = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  modifyObstructiveCode: false,
  fixturesFolder: 'src',
  waitForAnimations: false,
  chromeWebSecurity: false,
  video: true,
  videoCompression: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    codeCoverage: {
      exclude: ['src/**/*.cypress.spec.js?(x)'],
    },
    vaTopMobileViewportsIterateUptoIndex: 0,
    vaTopMobileViewports: [
      {
        list: 'VA Top Mobile Viewports',
        rank: 1,
        devicesWithViewport: 'iPhone 12 Pro, iPhone 12',
        percentTraffic: '9.0%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-mobile-1',
        width: 390,
        height: 844,
      },
      {
        list: 'VA Top Mobile Viewports',
        rank: 2,
        devicesWithViewport: 'iPhone 12 Pro Max',
        percentTraffic: '6.51%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-mobile-2',
        width: 428,
        height: 926,
      },
      {
        list: 'VA Top Mobile Viewports',
        rank: 3,
        devicesWithViewport:
          'iPhone XS Max, iPhone XR, iPhone 11, iPhone 11 Pro Max',
        percentTraffic: '6.02%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-mobile-3',
        width: 414,
        height: 896,
      },
      {
        list: 'VA Top Mobile Viewports',
        rank: 4,
        devicesWithViewport: 'iPhone X, iPhone XS, iPhone 11 Pro',
        percentTraffic: '4.3%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-mobile-4',
        width: 375,
        height: 812,
      },
      {
        list: 'VA Top Mobile Viewports',
        rank: 5,
        devicesWithViewport:
          'iPhone SE 2nd gen, iPhone 6, iPhone 6s, iPhone 7, iPhone 8',
        percentTraffic: '2.54%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-mobile-5',
        width: 375,
        height: 667,
      },
    ],
    vaTopTabletViewportsIterateUptoIndex: 0,
    vaTopTabletViewports: [
      {
        list: 'VA Top Tablet Viewports',
        rank: 1,
        devicesWithViewport:
          'iPad 1-6, iPad mini, iPad Air 1-2, iPad Pro (1st gen 9.7")',
        percentTraffic: '0.68%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-tablet-1',
        width: 768,
        height: 1024,
      },
      {
        list: 'VA Top Tablet Viewports',
        rank: 2,
        devicesWithViewport: 'iPad 7th gen',
        percentTraffic: '0.31%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-tablet-2',
        width: 810,
        height: 1080,
      },
      {
        list: 'VA Top Tablet Viewports',
        rank: 3,
        devicesWithViewport:
          'Amazon KSFUWI Fire HD 10 (2017), Amazon KFMAWI Fire HD 10 (2019), Samsung SM-T580 Galaxy Tab A 10.1, Samsung SM-T510 Galaxy Tab A 10.1 (2019), Samsung SM-T560NU Galaxy Tab E',
        percentTraffic: '0.28%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-tablet-3',
        width: 800,
        height: 1280,
      },
      {
        list: 'VA Top Tablet Viewports',
        rank: 4,
        devicesWithViewport:
          'Amazon KFGIWI Kindle Fire HD 8 2016, Amazon KFDOWI Kindle Fire HD 8 (2017), Amazon KFKAWI Fire HD 8 (2018), Amazon KFKAWI Fire HD 8 (2018)',
        percentTraffic: '0.28%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-tablet-4',
        width: 601,
        height: 962,
      },
      {
        list: 'VA Top Tablet Viewports',
        rank: 5,
        devicesWithViewport:
          'This viewport is missing from the devices lookup table. Please contact the Testing Tools Team to have it added.',
        percentTraffic: '0.19%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-tablet-5',
        width: 534,
        height: 854,
      },
    ],
    vaTopDesktopViewportsIterateUptoIndex: 0,
    vaTopDesktopViewports: [
      {
        list: 'VA Top Desktop Viewports',
        rank: 1,
        devicesWithViewport: 'This property is not set for desktops.',
        percentTraffic: '17.02%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-desktop-1',
        width: 1920,
        height: 1080,
      },
      {
        list: 'VA Top Desktop Viewports',
        rank: 2,
        devicesWithViewport: 'This property is not set for desktops.',
        percentTraffic: '4.73%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-desktop-2',
        width: 1440,
        height: 900,
      },
      {
        list: 'VA Top Desktop Viewports',
        rank: 3,
        devicesWithViewport: 'This property is not set for desktops.',
        percentTraffic: '3.63%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-desktop-3',
        width: 1366,
        height: 768,
      },
      {
        list: 'VA Top Desktop Viewports',
        rank: 4,
        devicesWithViewport: 'This property is not set for desktops.',
        percentTraffic: '2.87%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-desktop-4',
        width: 1536,
        height: 864,
      },
      {
        list: 'VA Top Desktop Viewports',
        rank: 5,
        devicesWithViewport: 'This property is not set for desktops.',
        percentTraffic: '2.48%',
        percentTrafficPeriod: 'From: 12/01/2022, To: 12/31/2022',
        viewportPreset: 'va-top-desktop-5',
        width: 1280,
        height: 720,
      },
    ],
  },
  e2e: {
    setupNodeEvents(on, config) {
      const nodeConfig = require('../src/platform/testing/e2e/cypress/plugins/index')(
        on,
        config,
      );
      // We only want Cypress specs annotated while being run outside of stress test jobs
      if (typeof process.env.IS_STRESS_TEST === 'undefined') {
        on('task', {
          recordNetworkTouch(specAbs) {
            try {
              const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
              const abs = path.resolve(String(specAbs));
              const rel = path.relative(workspace, abs).replace(/\\/g, '/');
              touchedSpecs.add(abs);
              touchedSpecs.add(rel);
            } catch (_) {
              touchedSpecs.add(String(specAbs));
            }
            return null;
          },
          emitAnnotationNow(specPath) {
            const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
            const abs = path.resolve(String(specPath));
            const rel = path.relative(workspace, abs).replace(/\\/g, '/');
            ghAnnotate({
              file: rel,
              line: 1,
              title: 'Unhandled network calls',
              message:
                'This spec made real network requests. Use cy.intercept() or stubs.',
            });
            return null;
          },
        });

        on('after:spec', spec => {
          const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
          const abs = spec.absolute;
          const rel = path.relative(workspace, abs).replace(/\\/g, '/');
          const matched =
            touchedSpecs.has(abs) ||
            touchedSpecs.has(rel) ||
            [...touchedSpecs].some(s => String(s).endsWith(rel));
          if (!matched) return;
          touchedSpecs.delete(abs);
          touchedSpecs.delete(rel);
          ghAnnotate({
            file: rel,
            line: 1,
            title: 'Unhandled network calls',
            message:
              'This spec made real network requests—add cy.intercept() or stubs.',
          });
        });
      }

      return nodeConfig || config;
    },
    baseUrl: dynamicBaseUrl,
    specPattern: 'src/**/tests/**/*.cypress.spec.js?(x)',
    supportFile: 'src/platform/testing/e2e/cypress/support/index.js',
    includeShadowDom: true,
  },
};

module.exports = {
  ...defineConfig(cypressConfig),

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
};
