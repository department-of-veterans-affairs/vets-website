import React from 'react';

export const PrefillAlert = ({ children }) => {
  return (
    <va-alert slim>
      <p className="vads-u-margin-y--0">{children}</p>
    </va-alert>
  );
};
