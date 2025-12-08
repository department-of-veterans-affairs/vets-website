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
import MyCaseManagementHub from './containers/MyCaseManagementHub';
import CareerExplorationAndPlanning from './containers/CareerExplorationAndPlanning';
import OrientationToolsAndResources from './containers/OrientationToolsAndResources';
import Phase2FeatureToggleGate from './components/Phase2FeatureToggleGate';

const withRequiredLogin = (Component, fallbackTitle) => props => {
  const user = useSelector(selectUser);
  return (
    <RequiredLoginView user={user}>
      <div className="row">
        <DowntimeNotification
          appTitle="Veteran Readiness and Employment - Eligibility and Entitlement"
          dependencies={[externalServices.vreCh31Eligibility]}
        >
          <Phase2FeatureToggleGate fallbackTitle={fallbackTitle}>
            <Component {...props} />
          </Phase2FeatureToggleGate>
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
        path="/my-case-management-hub"
        component={withRequiredLogin(
          MyCaseManagementHub,
          'My Case Management Hub',
        )}
      />
      <Route
        exact
        path="/"
        component={withRequiredLogin(
          MyEligibilityAndBenefits,
          'My Eligibility and Benefits',
        )}
      />
      <Route
        exact
        path="/career-exploration-and-planning"
        component={withRequiredLogin(
          CareerExplorationAndPlanning,
          'Career Exploration and Planning',
        )}
      />
      <Route
        exact
        path="/orientation-tools-and-resources"
        component={withRequiredLogin(
          OrientationToolsAndResources,
          'Orientation Tools and Resources',
        )}
      />
    </Switch>
  </App>
);

export default routes;
