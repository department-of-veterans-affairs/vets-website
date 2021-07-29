import React from 'react';
import LinkComponent from '../components/LinkComponent';
import { useLocation } from 'react-router-dom';
import GetHelp from '../components/GetHelp';

const OverviewPage = () => {
  const location = useLocation();

  return (
    <>
      <h1>Your current copay balances</h1>
      <p>
        Check your VA health care copay balances. Find out how to make payments
        or request financial help.
      </p>
      <p>Current location: {location.pathname}</p>
      <LinkComponent url="copay-detail" />
      <GetHelp />
    </>
  );
};

export default OverviewPage;
