import PropTypes from 'prop-types';
import React from 'react';

import EmailVICHelp from 'platform/static-data/EmailVICHelp';

function RequiredVeteranView({ userProfile, children }) {
  let view;

  if (userProfile.veteranStatus?.status === 'SERVER_ERROR') {
    // If veteran status is null, show a system down message.
    view = (
      <div className="row">
        <div className="small-12 columns">
          <div>
            <h3>
              We’re sorry. We can’t process your request for a Veteran ID Card
              right now because we can't access your records at the moment.
              Please try again in a few minutes.
            </h3>
            <h4>
              <span>
                Please <EmailVICHelp />
              </span>
            </h4>
            <a href="/">Go back to VA.gov</a>
          </div>
        </div>
      </div>
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
