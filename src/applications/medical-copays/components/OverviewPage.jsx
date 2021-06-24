import React from 'react';
import LinkComponent from './LinkComponent';

const OverviewPage = () => {
  return (
    <>
      <h1>Current copay balances</h1>
      <LinkComponent path="copay-detail" />
    </>
  );
};

export default OverviewPage;
