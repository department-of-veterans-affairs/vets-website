import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, formatPercent } from '../utils/helpers';

class UserInfoSection extends React.Component {
  render() {
    const { userData } = this.props;

    // Used to get today's date to show information current of
    const todayFormatted = formatDate(new Date());

    // Check if percent is a number
    const percentageBenefit = formatPercent(userData.percentageBenefit) || 'unavailable';

    // TODO: Figure out what will be sent to us if the user is ineligible so we can
    // conditionally show "Currently Disallowed" message

    return (
      <div>
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
            {formatDate(userData.dateOfBirth)}
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
          <div className="section-line">You are eligible to receive benefits between <strong>{formatDate(userData.eligibilityDate)}</strong> and <strong>{formatDate(userData.delimitingDate)}</strong></div>
        </div>
        <div>
          <h4>Your Benefit Level</h4>
          <div className="section-line">You are eligible to receive benefits at a rate of <strong>{percentageBenefit}</strong></div>
        </div>
      </div>
    );
  }
}

UserInfoSection.propTypes = {
  userData: PropTypes.object
};

export default UserInfoSection;
