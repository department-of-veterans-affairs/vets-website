import { commonStore } from '../store';

import environment from './environment.js';
import handleVerify from './verify-user.js';
import { updateLoggedInStatus, updateProfileField } from '../actions';

export default function getUserData() {
  fetch(`${environment.API_URL}/v0/user`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${localStorage.userToken}`
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    const userData = json.data.attributes.profile;
    if (userData.loa.current === 1 && userData.loa.highest === 3) {
      handleVerify();
    } else {
      // console.log(json);
      commonStore.dispatch(updateProfileField('accountType', userData.loa.current));
      commonStore.dispatch(updateProfileField('email', userData.email));
      commonStore.dispatch(updateProfileField('userFullName.first', userData.first_name));
      commonStore.dispatch(updateProfileField('userFullName.middle', userData.middle_name));
      commonStore.dispatch(updateProfileField('userFullName.last', userData.last_name));
      commonStore.dispatch(updateProfileField('gender', userData.gender));
      commonStore.dispatch(updateProfileField('dob', userData.birth_date));
      commonStore.dispatch(updateLoggedInStatus(true));
    }
  });
}
