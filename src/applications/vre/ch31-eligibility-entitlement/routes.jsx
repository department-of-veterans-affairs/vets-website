import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'platform/user/selectors';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';

const withRequiredLogin = Component => props => {
  const user = useSelector(selectUser);
  return (
    <RequiredLoginView user={user}>
      <Component {...props} />
    </RequiredLoginView>
  );
};

const routes = (
  <App>
    <Switch>
      <Route
        exact
        path="/"
        component={withRequiredLogin(MyEligibilityAndBenefits)}
      />
    </Switch>
  </App>
);

export default routes;
