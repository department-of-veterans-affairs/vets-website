import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import App from './containers/App';

const AccessGuardWrapper = ({ children }) => {
  const redirectToMyHealth = useMyHealthAccessGuard();
  if (redirectToMyHealth) {
    return redirectToMyHealth;
  }
  return children;
};

const routes = (
  <Switch>
    <AccessGuardWrapper>
      <Route path="/" key="App">
        <App />
      </Route>
    </AccessGuardWrapper>
  </Switch>
);

export default routes;
