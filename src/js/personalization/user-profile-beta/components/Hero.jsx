import React from 'react';

export default function Hero({ userFullName, tour, profilePicture }) {
  return (
    <div className="profile-hero" style={{ display: 'flex' }}>
      <div>
        <div>
          <img alt="You" style={{ height: '8em' }} src={profilePicture}/>
        </div>
      </div>
      <div style={{ marginLeft: 25 }}>
        <h2 style={{ margin: 0 }}>{userFullName.first} {userFullName.last}</h2>
        <p className="va-introtext">United States {tour.serviceBranch}</p>
      </div>
    </div>
  );
}
