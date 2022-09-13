import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const EmergencyNote = () => (
  <section className="emergency-note">
    <p className="medium-screen:vads-u-margin-top--0">
      <strong>Note:</strong> Call <va-telephone contact="911" /> if you have a
      medical emergency. If you’re in crisis and need to talk with someone now,
      call the Veterans Crisis Line{' '}
      <va-telephone contact={CONTACTS.CRISIS_LINE} />. To speak with a VA health
      care team member right away, contact your local VA call center.
    </p>
  </section>
);

export default EmergencyNote;
