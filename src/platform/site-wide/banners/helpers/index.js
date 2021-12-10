export const deriveStorage = banner => {
  const dismissibleStatus = banner?.dataset?.dismissibleStatus;

  // Don't have storage if the banner is not dismissible.
  if (dismissibleStatus === 'perm') {
    return undefined;
  }

  // If the banner is dismiss-session, we'll use sessionStorage.
  if (dismissibleStatus === 'dismiss-session') {
    return window.sessionStorage;
  }

  // Use localStorage by default.
  return window.localStorage;
};
