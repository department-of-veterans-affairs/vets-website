export const errorMessages = {
  network: `We had a connection issue on our end. Please try again in a few minutes.`,
  tooManyRequests: `There are too many requests. Please try again in a few minutes.`,
};

export const errorCodes = {
  GENERAL_ERROR: 110,
  ACCOUNT_PROVISIONING_ERROR: 111,
};

export const datadogEvents = {
  ERROR: 'Terms of Use Error',
  PROVISIONING_FAILED: 'Terms of Use Error - Provisioning Failed',
  ACCOUNT_NOT_PROVISIONED: 'Terms of Use Error - Account Not Provisioned',
  NETWORK_ERROR: 'Terms of Use Error - Network Error',
  API_ERROR_DURING_ACTION: 'Terms of Use Error - API Error During Action',
};

export const touStyles = `
  #vetnav { display: none; }
  #legacy-header { min-height: auto; }
  #login-root { visibility: hidden; }
  #mega-menu { min-height: auto; }
  #legacy-header > div:nth-child(3) > div.menu-rule.usa-one-whole { display: none; }
  #header-v2 > div > nav > div > div { visibility: hidden; }
`;
