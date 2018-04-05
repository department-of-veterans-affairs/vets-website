import React from 'react';

export default function Hero({ userFullName, serviceHistoryResponseData }) {
  const service = serviceHistoryResponseData && serviceHistoryResponseData.serviceHistory[0];
  return (
    <div className="profile-hero">
      <div className="row-padded">
        <h2>{userFullName.first} {userFullName.middle} {userFullName.last}</h2>
        {service && <h3>United States {service.branchOfService}</h3>}
      </div>
    </div>
  );
}
