/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import Main from './Main';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.

export function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <div className="row">
        <div className="small-12 columns">
          <h4>
            If none of the above situations applies to you, and you think your
            Statement of Benefits should be here, please call the GI Bill
            Hotline at <a href="tel:8884424551">888-442-4551</a>.
          </h4>
          <br />
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return <div className="row">{view}</div>;
}

AppContent.propTypes = {
  children: PropTypes.node,
  isDataAvailable: PropTypes.bool,
};

function Post911GIBStatusApp({ user, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.enableLightHouse);
  const useLighthouse = toggleValue
    ? backendServices.LIGHTHOUSE
    : backendServices.EVSS_CLAIMS;
  return (
    <RequiredLoginView verify serviceRequired={useLighthouse} user={user}>
      <DowntimeNotification
        appTitle="Post-9/11 GI Bill benefits tracking tool"
        dependencies={[externalServices.lighthouseBenefitsEducation]}
      >
        <AppContent>
          <Main apiVersion={{ apiVersion: 'v1' }}>{children}</Main>
        </AppContent>
      </DowntimeNotification>
    </RequiredLoginView>
  );
}

Post911GIBStatusApp.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Post911GIBStatusApp);
