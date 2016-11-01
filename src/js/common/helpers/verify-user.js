import { commonStore } from '../store';

export default function handleVerify() {
  const myStore = commonStore.getState();
  const login = myStore.login;
  const myVerifyUrl = login.loginUrl.third;
  const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
  receiver.focus();
}
