/**
 * Helper that prefixes class names with an optional responsive prefix and the
 * `vads-u-` utility class prefix.
 *
 * @param {string[]} classes - Array of classes to prefix with `vads-u-`
 * @param {string} screenSize - Optional screen size
 * @returns {string[]} The input `classes` array with the correct prefixes
 * applied
 *
 * Example: `prefixUtilityClasses(['my-class'], 'medium')` returns
 * ['medium-screen:vads-u-my-class']
 */
const prefixUtilityClasses = (classes, screenSize = '') => {
  const colonizedScreenSize = screenSize ? `${screenSize}-screen:` : '';
  return classes.map(className => `${colonizedScreenSize}vads-u-${className}`);
};

export default prefixUtilityClasses;
