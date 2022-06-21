import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function ErrorMessage() {
  return (
    <p>
      If you’d like to complete this form by phone, please call{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> and press 2. We’re here
      Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <abbr title="eastern time">ET</abbr>.
    </p>
  );
}
