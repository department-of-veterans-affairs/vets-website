// import appendQuery from 'append-query';
import Raven from 'raven-js';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
};

const SESSIONS_URI = `${environment.API_URL}/sessions`;
const sessionTypeUrl = type => `${SESSIONS_URI}/${type}/new`;

const SIGNUP_URL = sessionTypeUrl('signup');
const MHV_URL = sessionTypeUrl('mhv');
const DSLOGON_URL = sessionTypeUrl('dslogon');
const IDME_URL = sessionTypeUrl('idme');
const MFA_URL = sessionTypeUrl('mfa');
const VERIFY_URL = sessionTypeUrl('verify');
const LOGOUT_URL = sessionTypeUrl('slo');

const loginUrl = policy => {
  switch (policy) {
    case 'mhv':
      return MHV_URL;
    case 'dslogon':
      return DSLOGON_URL;
    default:
      return IDME_URL;
  }
};

export function setRavenLoginType(loginType) {
  Raven.setTagsContext({ loginType });
}

export function clearRavenLoginType() {
  const context = Raven.getContext(); // Note: Do not mutate context directly.
  const tags = { ...context.tags };
  delete tags.loginType;
  Raven.setTagsContext(tags);
}

/* Commented to verify a possible issue with browser extensions
function redirectWithGAClientId(redirectUrl) {
  try {
    // eslint-disable-next-line no-undef
    const trackers = ga.getAll();

    // Tracking IDs for Staging and Prod
    const vagovTrackingIds = ['UA-50123418-16', 'UA-50123418-17'];

    const tracker = trackers.find(t => {
      const trackingId = t.get('trackingId');
      return vagovTrackingIds.includes(trackingId);
    });

    const clientId = tracker && tracker.get('clientId');

    window.location = clientId
      ? // eslint-disable-next-line camelcase
        appendQuery(redirectUrl, { client_id: clientId })
      : redirectUrl;
  } catch (e) {
    window.location = redirectUrl;
  }
}
*/

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  sessionStorage.setItem(authnSettings.RETURN_URL, window.location);
  recordEvent({ event: clickedEvent });

  /* temporarily commented out to test a possible plugin related issue
  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(redirectUrl);
  } else {
    window.location = redirectUrl;
  }
*/
  window.location = redirectUrl;
}

export function login(policy) {
  return redirect(loginUrl(policy), 'login-link-clicked-modal');
}

export function mfa() {
  return redirect(MFA_URL, 'multifactor-link-clicked');
}

export function verify() {
  return redirect(VERIFY_URL, 'verify-link-clicked');
}

export function logout() {
  clearRavenLoginType();
  return redirect(LOGOUT_URL, 'logout-link-clicked');
}

export function signup() {
  return redirect(SIGNUP_URL, 'register-link-clicked');
}
