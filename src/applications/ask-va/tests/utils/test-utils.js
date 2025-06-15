export const createURLSearchParamsMock = mockValue => ({
  constructor: () => {},
  get: param => (param === 'showSignInModal' ? mockValue : null),
});
