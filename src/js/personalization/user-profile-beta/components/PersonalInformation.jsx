import React from 'react';
import moment from '../../../common/utils/moment-setup';
import SSNWidget from '../../../common/schemaform/review/SSNWidget';

export default function PersonalInformation({ gender, dob, ssn, serviceHistoryResponseData }) {
  let serviceHistory = serviceHistoryResponseData && serviceHistoryResponseData.serviceHistory;
  if (!serviceHistory) serviceHistory = [];

  return (
    <div>
      <h3>Gender</h3>
      {gender === 'M' ? 'Male' : 'Female'}
      <h3>Birth date</h3>
      {moment(dob).format('MMM D, YYYY')}
      <h3>Social security number</h3>
      <SSNWidget value={ssn}/>
      <h2>Military Service</h2>
      {serviceHistory.map((service, index) => {
        return (
          <div key={index}>
            <h3>{service.branchOfService}</h3>
            <div>{moment(service.beginDate).format('MMM D, YYYY')} &ndash; {moment(service.endDate).format('MMM D, YYYY')}</div>
          </div>
        );
      })}
      {serviceHistory.length === 0 && <em>Failed to find service history.</em>}
    </div>
  );
}
