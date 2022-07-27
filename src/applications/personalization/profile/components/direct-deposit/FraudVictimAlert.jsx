import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

const FraudVictimAlert = () => (
  <>
    <va-alert status="info" background-only>
      <strong>Note:</strong> If you think you’ve been the victim of bank fraud,
      please call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
      <va-telephone contact={CONTACTS['711']} />
      ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </va-alert>
  </>
);

export default FraudVictimAlert;
