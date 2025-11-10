import { setLoggedInFlow, getLoggedInFlow } from '../utils/sessionStorage';

function setIsLoggingIn(isLoggedIn, setIsAuthTopic) {
  if (!isLoggedIn) {
    if (getLoggedInFlow() === 'true') {
      setIsAuthTopic('false');
      setLoggedInFlow('false');
    }
    setIsAuthTopic(true);
    setTimeout(() => {
      setLoggedInFlow('true');
    }, 1);
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
