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
  const handler = () => {
    setTimeout(() => setIsLoggingIn(isLoggedIn, setIsAuthTopic), 2000);
  };

  window.addEventListener('webchat-auth-activity', handler);

  return () => window.removeEventListener('webchat-auth-activity', handler);
}
