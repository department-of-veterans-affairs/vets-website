import React from 'react';
import GetHelp from '../components/GetHelp';
import StatusAlert from '../components/StatusAlert';

const OverviewPage = () => {
  return (
    <>
      <h1>Your current copay balances</h1>
      <p className="sub-title">
        Check your VA health care copay balances. Find out how to make payments
        or request financial help.
      </p>
      <StatusAlert amount={130} />
      <h2>What you owe to each facility</h2>
      BALANCE CARDS
      <GetHelp />
    </>
  );
};

export default OverviewPage;
