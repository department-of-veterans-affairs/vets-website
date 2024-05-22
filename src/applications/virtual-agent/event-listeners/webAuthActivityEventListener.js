import { setLoggedInFlow } from '../utils/sessionStorage';

function setIsLoggingIn(isLoggedIn, setIsAuthTopic) {
  if (!isLoggedIn) {
    setLoggedInFlow('true');
    setIsAuthTopic(true);
  }
}

export default function webAuthActivityEventListener(
  isLoggedIn,
  setIsAuthTopic,
) {
  window.addEventListener('webchat-auth-activity', () => {
    setTimeout(() => setIsLoggingIn(isLoggedIn, setIsAuthTopic), 2000);
  });
}
