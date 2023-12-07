export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

// TODO: Delete this function once LOA3 is fully working.
// While LOA3 is still in progress, we need to be able to
// activate pages even when User's not logged in right now.
export function getUserBasedDepends(formData) {
  // return true form-page depends if
  // user's not logged in, or
  // user's logged in and ID-verified
  return (
    !formData['view:userLoggedIn'] ||
    (formData['view:userLoggedIn'] && formData['view:userIdVerified'])
  );
}
