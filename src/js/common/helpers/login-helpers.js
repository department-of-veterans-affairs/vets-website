// import moment from 'moment';
import { commonStore } from '../store';

import environment from './environment.js';
import { updateLoggedInStatus, updateProfileField } from '../actions';

export function handleVerify() {
  const myStore = commonStore.getState();
  const login = myStore.login;
  const myVerifyUrl = login.loginUrl.third;
  const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
  receiver.focus();
}

export function getUserData() {
  fetch(`${environment.API_URL}/v0/user`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${localStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    const userData = json.data.attributes.profile;
    // This will require the user to login again after 30 mins. We can decide what the correct amount of time is later.
    // if ((userData.loa.highest === 3) && (userData.loa.current === 1 || (moment() > moment(userData.last_signed_in).add(1, 'm')))) {
    //   handleVerify();
    // } else {
      // console.log(json);
    commonStore.dispatch(updateProfileField('accountType', userData.loa.current));
    commonStore.dispatch(updateProfileField('email', userData.email));
    commonStore.dispatch(updateProfileField('userFullName.first', userData.first_name));
    commonStore.dispatch(updateProfileField('userFullName.middle', userData.middle_name));
    commonStore.dispatch(updateProfileField('userFullName.last', userData.last_name));
    commonStore.dispatch(updateProfileField('gender', userData.gender));
    commonStore.dispatch(updateProfileField('dob', userData.birth_date));
    commonStore.dispatch(updateLoggedInStatus(true));
    // }
  });
}
