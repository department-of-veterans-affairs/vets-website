import $ from 'jquery';
import { commonStore } from '../store';

import environment from './environment.js';
import { updateLoggedInStatus, updateProfileField } from '../actions';

export function handleLogin() {
  this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=1`, result => {
    const myVerifyUrl = result.authenticate_via_get;
    const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  });
}


export function handleVerify() {
  this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
    const myVerifyUrl = result.authenticate_via_get;
    const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  });
}

export function getUserData() {
  fetch(`${environment.API_URL}/v0/user`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${sessionStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    const userData = json.data.attributes.profile;
    commonStore.dispatch(updateProfileField('accountType', userData.loa.current));
    commonStore.dispatch(updateProfileField('email', userData.email));
    commonStore.dispatch(updateProfileField('userFullName.first', userData.first_name));
    commonStore.dispatch(updateProfileField('userFullName.middle', userData.middle_name));
    commonStore.dispatch(updateProfileField('userFullName.last', userData.last_name));
    commonStore.dispatch(updateProfileField('gender', userData.gender));
    commonStore.dispatch(updateProfileField('dob', userData.birth_date));
    commonStore.dispatch(updateLoggedInStatus(true));
  });
}

export function addEvent(element, eventName, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, callback); // eslint-disable-line prefer-template
  }
}
