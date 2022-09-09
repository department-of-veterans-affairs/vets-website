import React from 'react';
import LandingPageAuth from './LandingPageAuth';
import LandingPageUnauth from './LandingPageUnauth';

const App = () => {
  // const isLoggedIn = useSelector(state => state?.user.login.currentlyLoggedIn);
  const isLoggedIn = true;

  return isLoggedIn ? <LandingPageAuth /> : <LandingPageUnauth />;
};

export default App;
