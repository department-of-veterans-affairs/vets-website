import React from 'react';

export default function Hero({ userFullName, tour }) {
  return (
    <div className="profile-hero">
      <div className="row-padded">
        <h2>{userFullName.first} {userFullName.last}</h2>
        <h3>United States {tour.serviceBranch}</h3>
      </div>
    </div>
  );
}
