import React from 'react';
import GetHelp from '../components/GetHelp';
import StatusAlert from '../components/StatusAlert';
import Balances from '../components/Balances';

const OverviewPage = () => {
  return (
    <>
      <h1>Your current copay balances</h1>
      <p className="vads-u-font-size--lg">
        Check your VA health care copay balances. Find out how to make payments
        or request financial help.
      </p>
      <StatusAlert />
      <Balances />
      <GetHelp />
    </>
  );
};

export default OverviewPage;
