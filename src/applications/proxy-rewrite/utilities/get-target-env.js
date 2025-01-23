let targetEnv = '';

/**
 * Does a lookup on the URL search query for param `targetEnvironment`.
 * @todo Find out more details on how & where this param is set from - check `package.json` & `webpack.config.js`.
 * @returns The target environment the code is running on right now.
 *      Possible values: ['localhost' | 'vagovdev' | 'vagovstaging' | 'vagovprod']
 */
export const getTargetEnv = () => {
  // Default to vagovprod.
  targetEnv =
    targetEnv ||
    (window.location.search.match(/\btargetEnvironment=(\w+)/) || [])[1];

  return targetEnv;
};
