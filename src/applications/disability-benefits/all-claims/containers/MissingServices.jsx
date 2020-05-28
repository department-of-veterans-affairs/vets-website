import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const MissingServices = ({ children }) => {
  const content = (
    <>
      For help with your application, please call Veterans Benefits Assistance
      at{' '}
      <a
        href="tel:+18008271000"
        aria-label="8 0 0. 8 2 7. 1 0 0 0."
        className="no-wrap"
      >
        800-827-1000
      </a>
      , Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </>
  );
  return (
    <div className="usa-grid full-page-alert">
      <AlertBox
        isVisible
        headline="We’re sorry. It looks like we’re missing some information needed for your application"
        content={content}
        status="error"
      />
      {children}
    </div>
  );
};
