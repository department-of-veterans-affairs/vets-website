import React from 'react';
import LinkComponent from './LinkComponent';
import { useLocation } from 'react-router-dom';

const OverviewPage = () => {
  const location = useLocation();

  return (
    <>
      <h1>Current copay balances</h1>
      <p>Current location: {location.pathname}</p>
      <LinkComponent url="copay-detail" />
    </>
  );
};

export default OverviewPage;
