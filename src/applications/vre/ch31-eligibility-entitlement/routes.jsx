import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'platform/user/selectors';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';

const withRequiredLogin = Component => props => {
  const user = useSelector(selectUser);
  return (
    <RequiredLoginView user={user}>
      <div className="row">
        <DowntimeNotification
          appTitle="Veteran Readiness and Employment - Eligibility and Entitlement"
          dependencies={[externalServices.vreCh31Eligibility]}
        >
          <Component {...props} />
        </DowntimeNotification>
      </div>
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
