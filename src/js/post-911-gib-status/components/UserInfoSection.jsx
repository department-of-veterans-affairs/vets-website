import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

class UserInfoSection extends React.Component {
  render() {
    const { userData } = this.props;

    // Used to get today's date to show information current of
    const today = new Date();
    const todayFormatted = moment(today).format('MM/DD/YYYY');

    return (
      <div className="gibstatus">
        <h3 className="section-header">{userData.firstName} {userData.lastName}</h3>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">This information is current as of {todayFormatted}</h4>
          </div>
        </div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>Date of Birth: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {userData.dateOfBirth}
          </div>
        </div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>VA File Number: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {userData.vaFileNumber}
          </div>
        </div>
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>Regional Processing Office: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {userData.regionalProcessingOffice}
          </div>
        </div>
        <div>
          <h4>When You Can Receive Benefits</h4>
          <div className="section-line">You are eligible to receive benefits between <strong>{userData.eligibilityDate}</strong> and <strong>{userData.delimitingDate}</strong></div>
        </div>
        <div>
          <h4>Your Benefit Level</h4>
          <div className="section-line">You are eligible to receive benefits at a rate of <strong>{userData.percentageBenefit}</strong></div>
        </div>
      </div>
    );
  }
}

UserInfoSection.propTypes = {
  userData: PropTypes.object
};

export default UserInfoSection;
