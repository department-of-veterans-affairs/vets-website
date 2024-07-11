import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const editNote = () => (
  <p>
    <strong>Note:</strong> If you need to update your personal information, call
    us at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
    through Friday, 8:00 a.m. to 9:00 p.m. ET.
  </p>
);
