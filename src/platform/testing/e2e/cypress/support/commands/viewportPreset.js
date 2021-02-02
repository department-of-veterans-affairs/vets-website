const presets = {
  // Top mobile presets by traffic percentage, descending
  'va-top-mobile-1': { width: 414, height: 896 },
  'va-top-mobile-2': { width: 375, height: 812 },
  'va-top-mobile-3': { width: 375, height: 667 },
  'va-top-mobile-4': { width: 414, height: 736 },
  'va-top-mobile-5': { width: 360, height: 640 },
  // Top tablet presets by traffic percentage, descending
  'va-top-tablet-1': { width: 768, height: 1024 },
  'va-top-tablet-2': { width: 1920, height: 1080 },
  'va-top-tablet-3': { width: 800, height: 1280 },
  'va-top-tablet-4': { width: 1280, height: 720 },
  'va-top-tablet-5': { width: 1280, height: 800 },
  // Top desktop presets by traffic percentage, descending
  'va-top-desktop-1': { width: 1920, height: 1080 },
  'va-top-desktop-2': { width: 1280, height: 960 },
  'va-top-desktop-3': { width: 1366, height: 768 },
  'va-top-desktop-4': { width: 1440, height: 900 },
  'va-top-desktop-5': { width: 1536, height: 864 },
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