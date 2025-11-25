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
import CareerExplorationAndPlanning from './containers/CareerExplorationAndPlanning';
import OrientationToolsAndResources from './containers/OrientationToolsAndResources';

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
      <Route
        exact
        path="/career-exploration-and-planning"
        component={withRequiredLogin(CareerExplorationAndPlanning)}
      />
      <Route
        exact
        path="/orientation-tools-and-resources"
        component={withRequiredLogin(OrientationToolsAndResources)}
      />
    </Switch>
  </App>
);

export default routes;
