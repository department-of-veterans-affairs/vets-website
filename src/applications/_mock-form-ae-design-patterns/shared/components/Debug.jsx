import React from 'react';
import environment from 'platform/utilities/environment';

export const Debug = ({ data }) => {
  if (!environment.isLocalhost()) {
    return null;
  }
  try {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  } catch (e) {
    return <pre>{e.message}</pre>;
  }
};
