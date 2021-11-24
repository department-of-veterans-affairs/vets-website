export const AUTH_EVENTS = {
  MODAL_LOGIN: 'login-link-clicked-modal',
  SSO_LOGIN: 'sso-automatic-login',
  SSO_LOGOUT: 'sso-automatic-logout',
  MFA: 'multifactor-link-clicked',
  VERIFY: 'verify-link-clicked',
  LOGOUT: 'logout-link-clicked',
  REGISTER: 'register-link-clicked',
};

export const SERVICE_PROVIDERS = {
  logingov: { label: 'Login.gov', link: 'https://secure.login.gov/account' },
  idme: { label: 'ID.me', link: 'https://wallet.id.me/settings' },
  dslogon: {
    label: 'DS Logon',
    link: 'https://myaccess.dmdc.osd.mil/identitymanagement',
  },
  mhv: { label: 'My HealtheVet', link: 'https://www.myhealth.va.gov' },
  myhealthevet: { label: 'My HealtheVet', link: 'https://www.myhealth.va.gov' },
};
