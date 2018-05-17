import React from 'react';
import moment from '../../../../platform/startup/moment-setup';
import LoadFail, { fieldFailureMessage } from './LoadFail';

export default function MilitaryInformation({ militaryInformation }) {
  if (!militaryInformation) return <h1>Loading MilitaryInformation</h1>;

  const {
    serviceHistory: {
      serviceHistory
    }
  } = militaryInformation;

  return (
    <div>
      <h2 className="va-profile-heading">Military Service</h2>
      <p>If you need to make any updates or corrections, call the Vets.gov Help Desk at  <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>). We're here Monday-Friday, 8 a.m. - 8 p.m. (ET).</p>
      {!serviceHistory || serviceHistory.length === 0 ? fieldFailureMessage : serviceHistory.map((service, index) => {
        return (
          <div key={index}>
            <h3>{service.branchOfService}</h3>
            <div>{moment(service.beginDate).format('MMM D, YYYY')} &ndash; {moment(service.endDate).format('MMM D, YYYY')}</div>
          </div>
        );
      })}
    </div>
  );
}
