import React from 'react';

export const DeviceConnectionCard = ({ vendor, authUrl }) => {
  return (
    <div className="connect-device">
      <p>
        <h3>{vendor}</h3>
      </p>
      <p>
        <a href={authUrl}>Connect</a>
      </p>
    </div>
  );
};
