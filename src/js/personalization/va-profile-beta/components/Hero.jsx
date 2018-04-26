import React from 'react';

export default class Hero extends React.Component {
  render() {
    const { userFullName, serviceHistoryResponseData } = this.props;
    const service = serviceHistoryResponseData && serviceHistoryResponseData.serviceHistory[0];
    const fullName = [userFullName.first, userFullName.middle, userFullName.last].join(' ');
    const ariaLabel = `Profile: ${fullName}`;
    return (
      <div className="va-profile-hero">
        <div className="row-padded">
          <h1 aria-label={ariaLabel} className="page-header">{fullName}</h1>
          {service && <div className="service-branch">United States {service.branchOfService}</div >}
          <p>Review your contact, personal, and military service information—and find out how to make any needed updates or corrections.</p>
        </div>
      </div>
    );
  }
}
