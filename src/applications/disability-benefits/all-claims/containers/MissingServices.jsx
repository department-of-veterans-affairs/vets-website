import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export const MissingServices = ({ children }) => {
  const content = (
    <>
      For help with your application, please call Veterans Benefits Assistance
      at <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
      8:00 a.m. to 9:00 p.m. ET.
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
