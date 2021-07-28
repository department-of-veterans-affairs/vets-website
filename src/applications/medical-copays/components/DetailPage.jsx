import React from 'react';
import LinkComponent from './LinkComponent';
import { useLocation } from 'react-router-dom';

const DetailPage = () => {
  const location = useLocation();

  return (
    <>
      <h1>Your copay details</h1>
      <p>Current location: {location.pathname}</p>
      <LinkComponent url="copays" />
    </>
  );
};

export default DetailPage;
