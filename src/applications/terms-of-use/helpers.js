import {
  environment,
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
} from '@department-of-veterans-affairs/platform-utilities/exports';

export const parseRedirectUrl = url => {
  if (!url) {
    return `${environment.BASE_URL}`;
  }

  const parsedUrl = decodeURIComponent(url);
  const allowedDomains = [
    `${new URL(environment.BASE_URL).hostname}`, // va.gov
    `${eauthEnvironmentPrefixes[environment.BUILDTYPE]}eauth.va.gov`, // eauth
    `${cernerEnvPrefixes[environment.BUILDTYPE]}patientportal.myhealth.va.gov`, // cerner
    `${eauthEnvironmentPrefixes[environment.BUILDTYPE]}fed.eauth.va.gov`, // mobile
    `vamobile://login-success`, // mobile again
  ];

  const { protocol, hostname } = new URL(parsedUrl);
  const domain = protocol.includes('vamobile')
    ? `${protocol}//login-success`
    : hostname;

  if (allowedDomains.includes(domain)) {
    return parsedUrl.includes('mhv-portal-web') &&
      !parsedUrl.includes('?deeplinking=')
      ? parsedUrl.replace('&postLogin=true', '')
      : parsedUrl;
  }
  return `${environment.BASE_URL}`;
};

export const errorMessages = {
  network: `We had a connection issue on our end. Please try again in a few minutes.`,
};

export const touStyles = `
  #vetnav { display: none; }
  #legacy-header { min-height: auto; }
  #login-root { visibility: hidden; }
  #mega-menu { min-height: auto; }
  #legacy-header > div:nth-child(3) > div.menu-rule.usa-one-whole { display: none; }
  #header-v2 > div > nav > div > div { visibility: hidden; }
`;
