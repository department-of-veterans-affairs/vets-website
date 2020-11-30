const presets = {
  // Mobile top 5 presets by traffic percentage, descending
  'mobile-top5-1': { width: 414, height: 896 },
  'mobile-top5-2': { width: 375, height: 667 },
  'mobile-top5-3': { width: 375, height: 812 },
  'mobile-top5-4': { width: 414, height: 736 },
  'mobile-top5-5': { width: 320, height: 568 },
  // Tablet top 5 presets by traffic percentage, descending
  'tablet-top5-1': { width: 768, height: 1024 },
  'tablet-top5-2': { width: 810, height: 1080 },
  'tablet-top5-3': { width: 1024, height: 1366 },
  'tablet-top5-4': { width: 834, height: 1112 },
  'tablet-top5-5': { width: 834, height: 1194 },
  // Desktop top 5 presets by traffic percentage, descending
  'desktop-top5-1': { width: 1920, height: 1080 },
  'desktop-top5-2': { width: 1366, height: 768 },
  'desktop-top5-3': { width: 1280, height: 960 },
  'desktop-top5-4': { width: 1440, height: 900 },
  'desktop-top5-5': { width: 1536, height: 864 },
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

const viewportPresetHelper = (preset, orientation, options) => {
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
      viewportPresetHelper(preset, orientation, options);
    } catch (e) {
      throw new Error(e);
    }
  },
);
