import PropTypes from 'prop-types';
import React from 'react';

import SystemDownView from '../../common/components/SystemDownView';

class RequiredVeteranView extends React.Component {

  render() {
    let view;

    if (this.props.userProfile.veteranStatus === 'SERVER_ERROR') {
      // If eMIS status is null, show a system down message.
      view = <SystemDownView messageLine1="Sorry, we are temporarily unable to verify your Veteran status. Please try again later."/>;
    } else if (this.props.userProfile.veteranStatus === 'NOT_FOUND') {
      // If eMIS status is "not found", show message that we cannot find the user
      // in our system.
      view = <SystemDownView messageLine1="We couldn’t find records verifying your Veteran status." messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286. We’re open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET)."/>;
    } else if (this.props.userProfile.veteranStatus === 'OK') {
      if (this.props.userProfile.isVeteran !== true) {
        view = <SystemDownView messageLine1="Printed ID cards are only available to Veterans. We are unable to verify your Veteran status" messageLine2="If you believe this is an error, please call the Vets.gov Help Desk at 1-855-574-7286. We’re open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET)."/>;
      } else {
        view = this.props.children;
      }
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

RequiredVeteranView.propTypes = {
  userProfile: PropTypes.object.isRequired,
};

export default RequiredVeteranView;
