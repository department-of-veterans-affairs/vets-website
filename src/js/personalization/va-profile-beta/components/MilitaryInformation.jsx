import React from 'react';
import moment from '../../../../platform/startup/moment-setup';
import { fieldFailureMessage } from './LoadFail';

export default function MilitaryInformation({ serviceHistoryResponseData }) {
  const serviceHistory = serviceHistoryResponseData && serviceHistoryResponseData.serviceHistory;
  if (!serviceHistory || serviceHistory.length === 0) return fieldFailureMessage;

  return (
    <div>
      {serviceHistory.map((service, index) => {
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
