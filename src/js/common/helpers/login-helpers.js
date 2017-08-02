import environment from './environment.js';
import { updateLoggedInStatus } from '../../login/actions';
import { updateProfileField, profileLoadingFinished } from '../../user-profile/actions';

export function handleVerify(verifyUrl) {
  window.dataLayer.push({ event: 'verify-link-clicked' });
  if (verifyUrl) {
    window.dataLayer.push({ event: 'verify-link-opened' });
    const receiver = window.open(`${verifyUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }
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
      dispatch(updateProfileField('savedForms', json.data.attributes.in_progress_forms));
      dispatch(updateProfileField('prefillsAvailable', json.data.attributes.prefills_available));
      dispatch(updateProfileField('accountType', userData.loa.current));
      dispatch(updateProfileField('email', userData.email));
      dispatch(updateProfileField('userFullName.first', userData.first_name));
      dispatch(updateProfileField('userFullName.middle', userData.middle_name));
      dispatch(updateProfileField('userFullName.last', userData.last_name));
      dispatch(updateProfileField('gender', userData.gender));
      dispatch(updateProfileField('dob', userData.birth_date));
      dispatch(updateProfileField('status', json.data.attributes.va_profile.status));
      dispatch(updateProfileField('services', json.data.attributes.services));
      dispatch(updateProfileField('healthTermsCurrent', json.data.attributes.health_terms_current));
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

export function getLoginUrl(onUpdateLoginUrl) {
  const loginUrlRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=1`, {
    method: 'GET',
  }).then(response => {
    return response.json();
  }).then(json => {
    onUpdateLoginUrl(json.authenticate_via_get);
  });

  return loginUrlRequest;
}

export function handleLogin(loginUrl, onUpdateLoginUrl) {
  window.dataLayer.push({ event: 'login-link-clicked' });
  if (loginUrl) {
    window.dataLayer.push({ event: 'login-link-opened' });
    const receiver = window.open(`${loginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
    return getLoginUrl(onUpdateLoginUrl);
  }
  return Promise.reject('Could not log in; loginUrl not provided.');
}
