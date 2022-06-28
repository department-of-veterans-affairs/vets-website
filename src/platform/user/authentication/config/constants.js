export const defaultSignInProviders = {
  logingov: true,
  idme: true,
  dslogon: true,
  mhv: true,
};

export const defaultSignUpProviders = {
  logingov: true,
  idme: true,
};

export const defaultMobileQueryParams = {
  allowOAuth: true,
  allowPostLogin: false,
  allowRedirect: false,
};

export const defaultMobileOAuthOptions = {
  clientId: 'mobile',
  acr: 'ial2',
};

export const defaultWebOAuthOptions = {
  clientId: 'web',
  acr: 'min',
};
