/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import Main from './Main';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
const AppContent = ({ children, isDataAvailable }) => {
  if (isDataAvailable === false) {
    return (
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
  }

  return <div className="row">{children}</div>;
};
AppContent.propTypes = {
  children: PropTypes.node,
  isDataAvailable: PropTypes.bool,
};

const Post911GIBStatusApp = ({ children }) => {
  const user = useSelector(state => state.user);
  return (
    <RequiredLoginView
      verify
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
    >
      <AppContent>
        <Main apiVersion={{ apiVersion: 'v1' }}>{children}</Main>
      </AppContent>
    </RequiredLoginView>
  );
};

Post911GIBStatusApp.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
};

export default Post911GIBStatusApp;
