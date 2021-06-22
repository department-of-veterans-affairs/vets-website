import React from 'react';
import LinkComponent from './LinkComponent';

const DetailPage = () => {
  return (
    <>
      <h1>Your copay details</h1>
      <LinkComponent path="copays" />
    </>
  );
};

export default DetailPage;
