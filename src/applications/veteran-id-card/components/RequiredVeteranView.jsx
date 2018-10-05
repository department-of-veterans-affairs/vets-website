import PropTypes from 'prop-types';
import React from 'react';

import SystemDownView from '@department-of-veterans-affairs/formation/SystemDownView';

class RequiredVeteranView extends React.Component {
  render() {
    let view;

    if (this.props.userProfile.veteranStatus === 'SERVER_ERROR') {
      // If eMIS status is null, show a system down message.
      view = (
        <SystemDownView
          messageLine1="We’re sorry. We can’t process your request for a Veteran ID Card right now because we can't access your records at the moment. Please try again in a few minutes."
          messageLine2="If it still doesn’t work, please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."
        />
      );
    } else {
      view = this.props.children;
    }

    return <div>{view}</div>;
  }
}

RequiredVeteranView.propTypes = {
  userProfile: PropTypes.object.isRequired,
};

export default RequiredVeteranView;
