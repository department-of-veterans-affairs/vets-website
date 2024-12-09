import React from 'react';

export const BorderedInfoSection = ({ children }) => {
  return (
    <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-margin-y--3 vads-u-padding-left--2">
      {children}
    </div>
  );
};
