import PropTypes from 'prop-types';
import React from 'react';

import SystemDownView from '@department-of-veterans-affairs/formation-react/SystemDownView';

import EmailVICHelp from 'platform/static-data/EmailVICHelp';

function RequiredVeteranView({ userProfile, children }) {
  let view;

  if (userProfile.veteranStatus === 'SERVER_ERROR') {
    // If eMIS status is null, show a system down message.
    view = (
      <SystemDownView
        messageLine1="We’re sorry. We can’t process your request for a Veteran ID Card right now because we can't access your records at the moment. Please try again in a few minutes."
        messageLine2={
          <span>
            Please <EmailVICHelp />
          </span>
        }
      />
    );
  } else {
    view = children;
  }

  return <div>{view}</div>;
}

RequiredVeteranView.propTypes = {
  userProfile: PropTypes.object.isRequired,
};

export default RequiredVeteranView;
