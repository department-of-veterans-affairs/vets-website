/**
 * Playwright viewport presets matching VA.gov top traffic viewports.
 *
 * Port of cypress/support/commands/viewportPreset.js for Playwright.
 * Usage:
 *   const { presets, setViewportPreset } = require('./viewportPreset');
 *   await setViewportPreset(page, 'va-top-mobile-1');
 *   await setViewportPreset(page, 'va-top-desktop-1', 'landscape');
 */

const presets = {
  // Top mobile presets by traffic percentage, descending
  'va-top-mobile-1': { width: 390, height: 844 },
  'va-top-mobile-2': { width: 428, height: 926 },
  'va-top-mobile-3': { width: 414, height: 896 },
  'va-top-mobile-4': { width: 375, height: 812 },
  'va-top-mobile-5': { width: 375, height: 667 },
  // Top tablet presets by traffic percentage, descending
  'va-top-tablet-1': { width: 768, height: 1024 },
  'va-top-tablet-2': { width: 810, height: 1080 },
  'va-top-tablet-3': { width: 800, height: 1280 },
  'va-top-tablet-4': { width: 601, height: 962 },
  'va-top-tablet-5': { width: 534, height: 854 },
  // Top desktop presets by traffic percentage, descending
  'va-top-desktop-1': { width: 1920, height: 1080 },
  'va-top-desktop-2': { width: 1440, height: 900 },
  'va-top-desktop-3': { width: 1366, height: 768 },
  'va-top-desktop-4': { width: 1536, height: 864 },
  'va-top-desktop-5': { width: 1280, height: 720 },
};

/**
 * Sets the viewport to a named preset.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} preset - Preset name (e.g., 'va-top-mobile-1')
 * @param {'portrait'|'landscape'} [orientation='portrait']
 */
async function setViewportPreset(page, preset, orientation = 'portrait') {
  const dimensions = presets[preset];
  if (!dimensions) {
    throw new Error(
      `Unknown viewport preset "${preset}". Valid presets: ${Object.keys(
        presets,
      ).join(', ')}`,
    );
  }

  const { width, height } = dimensions;
  if (orientation === 'landscape') {
    await page.setViewportSize({ width: height, height: width });
  } else {
    await page.setViewportSize({ width, height });
  }
}

module.exports = { presets, setViewportPreset };
