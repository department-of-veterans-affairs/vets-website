import environment from './environment.js';
import { updateLoggedInStatus, updateLogInUrls } from '../../login/actions';
import { updateProfileFields, profileLoadingFinished } from '../../user-profile/actions';

export function handleVerify(verifyUrl) {
  window.dataLayer.push({ event: 'verify-link-clicked' });
  if (verifyUrl) {
    window.dataLayer.push({ event: 'verify-link-opened' });
    const receiver = window.open(`${verifyUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }
}

export function handleMultifactor(multifactorUrl) {
  window.dataLayer.push({ event: 'multifactor-link-clicked' });
  if (multifactorUrl) {
    window.dataLayer.push({ event: 'multifactor-link-opened' });
    const receiver = window.open(multifactorUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }
}

export function getVerifyUrl(onUpdateVerifyUrl) {
  const verifyUrlRequest = fetch(`${environment.API_URL}/v0/sessions/identity_proof`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${sessionStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    onUpdateVerifyUrl(json.identity_proof_url);
  });

  return verifyUrlRequest;
}

export function getMultifactorUrl(onUpdateMultifactorUrl) {
  const getMultifactorUrlRequest = fetch(`${environment.API_URL}/v0/sessions/multifactor`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${sessionStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    onUpdateMultifactorUrl(json.multifactor_url);
  });

  return getMultifactorUrlRequest;
}

export function getUserData(dispatch) {
  fetch(`${environment.API_URL}/v0/user`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${sessionStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    if (json.data) {
      const userData = json.data.attributes.profile;
      // sessionStorage coerces everything into String. this if-statement
      // is to prevent the firstname being set to the string 'Null'
      if (userData.first_name) {
        sessionStorage.setItem('userFirstName', userData.first_name);
      }
      dispatch(updateProfileFields({
        savedForms: json.data.attributes.in_progress_forms,
        prefillsAvailable: json.data.attributes.prefills_available,
        accountType: userData.loa.current,
        email: userData.email,
        userFullName: {
          first: userData.first_name,
          middle: userData.middle_name,
          last: userData.last_name,
        },
        authnContext: userData.authn_context,
        loa: userData.loa,
        multifactor: userData.multifactor,
        gender: userData.gender,
        dob: userData.birth_date,
        status: json.data.attributes.va_profile.status,
        veteranStatus: json.data.attributes.veteran_status.status,
        isVeteran: json.data.attributes.veteran_status.is_veteran,
        services: json.data.attributes.services,
        healthTermsCurrent: json.data.attributes.health_terms_current,
      }));
      dispatch(updateLoggedInStatus(true));
    } else {
      dispatch(profileLoadingFinished());
    }
  });
}

export function addEvent(element, eventName, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, callback); // eslint-disable-line prefer-template
  }
}

export function getLoginUrls(onUpdateLoginUrls) {
  const loginUrlsRequest = fetch(`${environment.API_URL}/v0/sessions/authn_urls`, {
    method: 'GET',
  }).then(response => {
    return response.json();
  }).then(json => {
    onUpdateLoginUrls(json);
  });

  return loginUrlsRequest;
}

export function handleLogin(loginUrl, onUpdateLoginUrls) {
  window.dataLayer.push({ event: 'login-link-clicked' });
  if (loginUrl) {
    window.dataLayer.push({ event: 'login-link-opened' });
    const receiver = window.open(`${loginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
    return getLoginUrls(onUpdateLoginUrls || updateLogInUrls);
  }
  return Promise.reject('Could not log in; loginUrl not provided.');
}

function isGaLoaded() {
  return !!(window.ga && ga.create);
}

// google analytics client Id
/* global gaClientId ga:true */
export function gaClientId() {
  let clientId;
  if (isGaLoaded()) {
    for (const data of ga.getAll()) {
      if (data.get('cookieDomain') === 'vets.gov') {
        clientId = data.get('clientId');
      }
    }
  }
  return clientId;
}
