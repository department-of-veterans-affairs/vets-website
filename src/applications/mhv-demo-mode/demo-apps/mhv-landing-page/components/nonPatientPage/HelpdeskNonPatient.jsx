import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const HelpdeskNonPatient = () => {
  return (
    <div
      className="vads-l-col--12 medium-screen:vads-l-col--8"
      data-testid="mhv-helpdesk-non-patient"
    >
      <h2 className="vads-u-margin-bottom--0">
        We don’t have VA health records for you
      </h2>
      <div className="vads-l-row">
        <p className="vads-u-font-size--md vads-u-margin-bottom--0">
          To use the health care tools on the new My HealtheVet experience, you
          must be registered at a VA health facility.
        </p>
        <p className="vads-u-font-size--md">
          If you think this is an error, call us at{' '}
          <va-telephone contact="8773270022" />({' '}
          <va-telephone contact={CONTACTS[711]} tty /> ). We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET. Ask the My HealtheVet
          coordinator to confirm you’re registered at a VA health facility.
        </p>
      </div>
    </div>
  );
};

export default HelpdeskNonPatient;
