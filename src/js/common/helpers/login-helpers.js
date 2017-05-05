import { commonStore } from '../store';

import environment from './environment.js';
import { updateLoggedInStatus } from '../../login/actions';
import { updateProfileField } from '../../user-profile/actions';

export function getUserData() {
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
      commonStore.dispatch(updateProfileField('accountType', userData.loa.current));
      commonStore.dispatch(updateProfileField('email', userData.email));
      commonStore.dispatch(updateProfileField('userFullName.first', userData.first_name));
      commonStore.dispatch(updateProfileField('userFullName.middle', userData.middle_name));
      commonStore.dispatch(updateProfileField('userFullName.last', userData.last_name));
      commonStore.dispatch(updateProfileField('gender', userData.gender));
      commonStore.dispatch(updateProfileField('dob', userData.birth_date));
      commonStore.dispatch(updateProfileField('status', json.data.attributes.va_profile.status));
      commonStore.dispatch(updateProfileField('services', json.data.attributes.services));
      commonStore.dispatch(updateLoggedInStatus(true));
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
