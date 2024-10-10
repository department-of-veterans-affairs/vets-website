import React, { useEffect, useState } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const NetworkRequest = () => {
  const [apiStatus, setApiStatus] = useState(null);
  useEffect(() => {
    apiRequest('/status', {
      apiVersion: 'v0',
    }).then(res => {
      setApiStatus(res);
    });
  });

  return <div>{apiStatus}</div>;
};

export default NetworkRequest;
