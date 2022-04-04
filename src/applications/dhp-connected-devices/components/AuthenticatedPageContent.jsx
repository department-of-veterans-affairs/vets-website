import React from 'react';
import { ConnectedDevicesContainer } from './ConnectDevicesContainer';

export const AuthenticatedPageContent = () => {
  // async function fitbitAuth() {
  //   // const response = await fetch('vets-api/path/to/connect/to/fitbit/connect');
  //   const response = 'success';
  //   console.log(response);
  //   if (response === 'success') {
  //     ;
  //   } else {
  //     return <DeviceConnectionFailedAlert />;
  //   }
  // }
  // return (
  //   <>
  //     {/* Displays user's connected devices */}
  //     <h2>Your connected devices</h2>
  //     <div>You do not have any devices connected</div>
  //     {/* Displays devices that users have not connected to */}
  //     <h2>Devices you can connect</h2>
  //     <div>
  //       Choose a device type below to connect. You will be directed to an
  //       external website and asked to enter your sign in information for that
  //       device. When complete, you will return to this page on VA.gov.
  //     </div>
  //     <div className="connected-devices-section">
  //       <DeviceConnectionCard vendor="Fitbit" handleOnClick={fitbitAuth} />
  //     </div>
  //   </>
  // );
  return <ConnectedDevicesContainer />;
};
