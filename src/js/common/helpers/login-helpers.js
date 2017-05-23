import environment from './environment.js';
import { updateLoggedInStatus } from '../../login/actions';
import { updateProfileField } from '../../user-profile/actions';

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
      dispatch(updateProfileField('accountType', userData.loa.current));
      dispatch(updateProfileField('email', userData.email));
      dispatch(updateProfileField('userFullName.first', userData.first_name));
      dispatch(updateProfileField('userFullName.middle', userData.middle_name));
      dispatch(updateProfileField('userFullName.last', userData.last_name));
      dispatch(updateProfileField('gender', userData.gender));
      dispatch(updateProfileField('dob', userData.birth_date));
      dispatch(updateProfileField('status', json.data.attributes.va_profile.status));
      dispatch(updateProfileField('services', json.data.attributes.services));
      dispatch(updateLoggedInStatus(true));
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
