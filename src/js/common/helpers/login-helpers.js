import environment from './environment.js';
import { updateLoggedInStatus, updateProfileField } from '../actions';

function handleLogin() {
  const myLoginUrl = this.props.login.loginUrl.first;
  const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
  receiver.focus();
}

function handleVerify() {
  const myLoginUrl = this.props.login.loginUrl.third;
  const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
  receiver.focus();
}

const onHandleLogin = handleLogin();
const onHandleVerify = handleVerify();

function getUserData() {
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
      onHandleVerify();
    } else {
      // console.log(json);
      updateProfileField('accountType', userData.loa.current);
      updateProfileField('email', userData.email);
      updateProfileField('userFullName.first', userData.first_name);
      updateProfileField('userFullName.middle', userData.middle_name);
      updateProfileField('userFullName.last', userData.last_name);
      updateProfileField('gender', userData.gender);
      updateProfileField('dob', userData.birth_date);
      updateLoggedInStatus(true);
    }
  });
}

const onGetUserData = getUserData();

module.exports = { onGetUserData, onHandleLogin, onHandleVerify };
