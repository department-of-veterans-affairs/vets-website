import { apiRequest } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';

const SESSIONS_URI = `${environment.API_URL}/sessions`;
const redirectUrl = (type) => `${SESSIONS_URI}/${type}/new`;

const MHV_URL = redirectUrl('mhv');
const DSLOGON_URL = redirectUrl('dslogon');
const IDME_URL = redirectUrl('idme');
const MFA_URL = redirectUrl('mfa');
const VERIFY_URL = redirectUrl('verify');
const LOGOUT_URL = redirectUrl('slo');

const loginUrl = (policy) => {
  switch (policy) {
    case 'mhv': return MHV_URL; break;
    case 'dslogon': return DSLOGON_URL; break;
    default: return IDME_URL;
  }
};

function popup(url, clickedEvent, openedEvent) {
  console.log(url);

  window.dataLayer.push({ event: clickedEvent });
  const popup = window.open('', 'vets.gov-popup', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
  if (popup) {
    console.log('popup');
    window.dataLayer.push({ event: openedEvent });
    popup.focus();

    const settings = {
      method: 'GET',
      headers: {
        Authorization: `Token token=${sessionStorage.userToken}`
      }
    };

    console.log('fetching');
    popup.fetch(url, settings)
      .then(response => {
        console.log('success');
        console.log(response);
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  }
}

export function login(policy) {
  popup(loginUrl(policy), 'login-link-clicked', 'login-link-opened');
}

export function logout() {
  popup(LOGOUT_URL, 'logout-link-clicked', 'logout-link-opened');
}

export function signup() {
  popup(IDME_URL, 'register-link-clicked', 'register-link-opened');
}
