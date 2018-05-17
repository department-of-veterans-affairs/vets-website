import React from 'react';

export default class Hero extends React.Component {
  render() {
    const {
      hero,
      militaryInformation
    } = this.props;

    if (!hero || !militaryInformation) return <h1>Loading hero</h1>;
    const {
      userFullName: {
        first,
        middle,
        last
      }
    } = hero;

    const {
      serviceHistory: {
        serviceHistory
      } = {}
    } = militaryInformation;

    const service = serviceHistory && serviceHistory[0];
    const fullName = [first, middle, last].join(' ');
    const ariaLabel = `Profile: ${fullName}`;
    return (
      <div className="va-profile-hero">
        <div className="row-padded">
          <h1 aria-label={ariaLabel} className="page-header">{fullName}</h1>
          {service && <div className="service-branch">United States {service.branchOfService}</div>}
          <p className="va-introtext">Review your contact, personal, and military service information—and find out how to make any needed updates or corrections.</p>
        </div>
      </div>
    );
  }
}
