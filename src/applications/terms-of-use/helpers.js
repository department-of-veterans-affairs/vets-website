import {
  environment,
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
  oracleHealthEnvPrefixes,
  logoutUrlSiS,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  logout as IAMLogout,
  AUTHN_SETTINGS,
} from '@department-of-veterans-affairs/platform-user/exports';

export const parseRedirectUrl = url => {
  if (!url) {
    return `${environment.BASE_URL}`;
  }

  const parsedUrl = decodeURIComponent(url);
  const allowedDomains = [
    `${new URL(environment.BASE_URL).hostname}`, // va.gov
    `${eauthEnvironmentPrefixes[environment.BUILDTYPE]}eauth.va.gov`, // eauth
    `${cernerEnvPrefixes[environment.BUILDTYPE]}patientportal.myhealth.va.gov`, // oracle health staging
    `${
      oracleHealthEnvPrefixes[environment.BUILDTYPE]
    }patientportal.myhealth.va.gov`, // oracle health sandbox
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

export const validateWhichRedirectUrlToUse = redirectionURL => {
  const storedURL = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL);
  const hostname = (storedURL && new URL(storedURL)?.hostname) ?? '';
  // Should be for USiP clients only
  if (
    storedURL &&
    !hostname?.includes(`${new URL(environment.BASE_URL).hostname}`)
  ) {
    return storedURL;
  }
  // should respect the query params
  return (
    redirectionURL.searchParams.get('redirect_url') ||
    redirectionURL.searchParams.get('ssoeTarget')
  );
};

export const declineAndLogout = ({
  termsCodeExists,
  isAuthenticatedWithSiS,
  shouldRedirectToMobile,
  ial2Enforcement,
}) => {
  if (termsCodeExists || isAuthenticatedWithSiS) {
    if (shouldRedirectToMobile) {
      window.location.assign('/terms-of-use/declined');
    } else {
      window.location = logoutUrlSiS({
        queryParams: { [`agreements_declined`]: true },
      });
    }
  } else {
    IAMLogout({
      queryParams: { [`agreements_declined`]: true },
      ial2Enforcement,
    });
  }
};

export const touUpdatedDate = `March 2024`;
