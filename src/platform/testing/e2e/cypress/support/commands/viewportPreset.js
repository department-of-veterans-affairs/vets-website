// iPhone viewports
const viewport320X480 = { width: 320, height: 480 };
const viewport320X568 = { width: 320, height: 568 };
const viewport360X780 = { width: 360, height: 780 };
const viewport375X667 = { width: 375, height: 667 };
const viewport375X812 = { width: 375, height: 812 };
const viewport390X844 = { width: 390, height: 844 };
const viewport414X736 = { width: 414, height: 736 };
const viewport414X896 = { width: 414, height: 896 };
const viewport428X926 = { width: 428, height: 926 };
// iPad viewports
const viewPort768X1024 = { width: 768, height: 1024 };
const viewPort810X1080 = { width: 810, height: 1080 };
const viewPort834X1112 = { width: 834, height: 1112 };
const viewPort834X1194 = { width: 834, height: 1194 };
const viewPort1024X1366 = { width: 1024, height: 1366 };
// Deskop viewports
const viewPort1280X960 = { width: 1280, height: 960 };
const viewPort1366X768 = { width: 1366, height: 768 };
const viewPort1440X900 = { width: 1440, height: 900 };
const viewPort1536X864 = { width: 1536, height: 864 };
const viewPort1920X1080 = { width: 1920, height: 1080 };

const presets = {
  // iPhone presets
  'iphone-1st-gen': viewport320X480,
  'iphone-3g': viewport320X480,
  'iphone-3gs': viewport320X480,
  'iphone-4': viewport320X480,
  'iphone-4s': viewport320X480,
  'iphone-5': viewport320X568,
  'iphone-5c': viewport320X568,
  'iphone-5s': viewport320X568,
  'iphone-6-plus': viewport414X736,
  'iphone-6': viewport375X667,
  'iphone-6s-plus': viewport414X736,
  'iphone-6s': viewport375X667,
  'iphone-se-1st-gen': viewport320X568,
  'iphone-7-plus': viewport414X736,
  'iphone-7': viewport375X667,
  'iphone-8-plus': viewport414X736,
  'iphone-8': viewport375X667,
  'iphone-x': viewport375X812,
  'iphone-xs-max': viewport414X896,
  'iphone-xs': viewport375X812,
  'iphone-xr': viewport414X896,
  'iphone-11-pro-max': viewport414X896,
  'iphone-11': viewport414X896,
  'iphone-11-pro': viewport375X812,
  'iphone-se-2nd-gen': viewport375X667,
  'iphone-12-pro-max': viewport428X926,
  'iphone-12': viewport390X844,
  'iphone-12-pro': viewport390X844,
  'iphone-12-mini': viewport360X780,
  // iPad presets
  'ipad-1': viewPort768X1024,
  'ipad-2': viewPort768X1024,
  'ipad-3': viewPort768X1024,
  'ipad-mini-1': viewPort768X1024,
  'ipad-4': viewPort768X1024,
  'ipad-air-1': viewPort768X1024,
  'ipad-mini-2': viewPort768X1024,
  'ipad-air-2': viewPort768X1024,
  'ipad-mini-3': viewPort768X1024,
  'ipad-mini-4': viewPort768X1024,
  'ipad-pro-1-12.9': viewPort1024X1366,
  'ipad-pro-1-9.7': viewPort768X1024,
  'ipad-5': viewPort768X1024,
  'ipad-pro-2-12.9': viewPort1024X1366,
  'ipad-pro-2--10.5': viewPort834X1112,
  'ipad-6': viewPort768X1024,
  'ipad-pro-3-12.9': viewPort1024X1366,
  'ipad-pro-3-11': viewPort834X1194,
  'ipad-air-3': viewPort834X1112,
  'ipad-mini-5': viewPort768X1024,
  'ipad-7': viewPort810X1080,
  'ipad-pro-4-12.9': viewPort1024X1366,
  'ipad-pro-4-11': viewPort834X1194,
  // Mobile top 5 presets by traffic percentage, ascending
  'mobile-top5-1': viewport414X896,
  'mobile-top5-2': viewport375X667,
  'mobile-top5-3': viewport375X812,
  'mobile-top5-4': viewport414X736,
  'mobile-top5-5': viewport320X568,
  // Tablet top 5 presets by traffic percentage, ascending
  'tablet-top5-1': viewPort768X1024,
  'tablet-top5-2': viewPort810X1080,
  'tablet-top5-3': viewPort1024X1366,
  'tablet-top5-4': viewPort834X1112,
  'tablet-top5-5': viewPort834X1194,
  // Desktop top 5 presets by traffic percentage, ascending
  'desktop-top5-1': viewPort1920X1080,
  'desktop-top5-2': viewPort1366X768,
  'desktop-top5-3': viewPort1280X960,
  'desktop-top5-4': viewPort1440X900,
  'desktop-top5-5': viewPort1536X864,
};

const isValidPreset = preset => presets[preset] !== undefined;

const isValidOrientation = orientation => {
  return orientation === 'portrait' || orientation === 'landscape';
};

const isValidOptions = options => {
  return (
    (typeof options === 'object' &&
      options !== null &&
      options.log &&
      options.log === true) ||
    options.log === false
  );
};

const presetError = "preset argument is invalid because preset doesn't exist";

const orientationError =
  "orientation argument must be 'portrait' or 'landscape'";

const optionsError =
  "options argument must be an object with a 'log' set to a boolean";

const formatErrors = errors => errors.map(e => `\n* ${e}`);

const setViewportHelper = (preset, orientation, options) => {
  if (
    isValidPreset(preset) &&
    isValidOrientation(orientation) &&
    isValidOptions(options)
  ) {
    const { width, height } = presets[preset];
    orientation === 'portrait'
      ? cy.viewport(width, height, options)
      : cy.viewport(height, width, options);
  } else if (
    !isValidPreset(preset) &&
    !isValidOrientation(orientation) &&
    !isValidOptions(options)
  ) {
    throw new Error(
      formatErrors([presetError, orientationError, optionsError]),
    );
  } else if (isValidPreset(preset) && isValidOrientation(orientation)) {
    throw new Error(formatErrors([optionsError]));
  } else if (isValidOrientation(orientation) && isValidOptions(options)) {
    throw new Error(formatErrors([presetError]));
  } else if (isValidPreset(preset) && isValidOptions(options)) {
    throw new Error(formatErrors([orientationError]));
  } else if (isValidPreset(preset)) {
    throw new Error(formatErrors([orientationError, optionsError]));
  } else if (isValidOrientation(orientation)) {
    throw new Error(formatErrors([presetError, optionsError]));
  } else {
    throw new Error(formatErrors([presetError, orientationError]));
  }
};

/**
 * Sets the viewport by preset name.
 * @param  {String} preset       The preset name
 * @param  {String} orientation  'portrait' or 'landscape', defaults to 'portrait'
 * @param  {Object} options      'log' property is set to a boolean, defaults to true
 */
Cypress.Commands.add(
  'viewportPreset',
  (preset, orientation = 'portrait', options = { log: true }) => {
    try {
      setViewportHelper(preset, orientation, options);
    } catch (e) {
      throw new Error(e);
    }
  },
);
