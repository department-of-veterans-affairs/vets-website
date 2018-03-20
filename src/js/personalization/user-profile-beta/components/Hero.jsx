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
        <h2 style={{ marginTop: 0 }}>{userFullName.first} {userFullName.last}</h2>
        United States {tour.serviceBranch}<br/>
        {tour.rank}
      </div>
    </div>
  );
}
