import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function ErrorMessage() {
  return (
    <p>
      If you’d like to complete this form by phone, please call{' '}
      <Telephone contact={CONTACTS['222_VETS']} /> and press 2. We’re here
      Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <abbr title="eastern time">ET</abbr>.
    </p>
  );
}
