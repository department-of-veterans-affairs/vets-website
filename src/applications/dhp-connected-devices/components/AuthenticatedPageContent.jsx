import React from 'react';
import { DeviceConnectionCard } from './DeviceConnectionCard';

export const AuthenticatedPageContent = () => {
  return (
    <>
      {/* Displays user's connected devices */}
      <h2>Your connected devices</h2>
      <div>You do not have any devices connected</div>
      {/* Displays devices that users have not connected to */}
      <h2>Devices you can connect</h2>
      <div>
        Choose a device type below to connect. You will be directed to an
        external website and asked to enter your sign in information for that
        device. When complete, you will return to this page on VA.gov.
      </div>
      <div className="connected-devices-section">
        <DeviceConnectionCard
          vendor="Fitbit"
          authUrl="https://www.fitbit.com/oauth2/authorize?client_id=<client_id>&response_type=code&code_challenge=<code_challenge>&code_challenge_method=S256&scope=weight%20location%20settings%20profile%20nutrition%20activity%20sleep%20heartrate%20social"
        />
      </div>
    </>
  );
};
