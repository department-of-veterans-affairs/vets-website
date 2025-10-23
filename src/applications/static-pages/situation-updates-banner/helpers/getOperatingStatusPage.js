/**
 * Returns the operating status page path for the given path or current path.
 * @param {string?} path
 */
export const getOperatingStatusPage = path => {
  if (path?.includes('operating-status')) {
    return path;
  }
  return `${window.location.pathname.split('/')[0]}/operating-status`;
};
