import React from 'react';
import { CONTACTS } from '../../utils/imports';

const RegistrationOnlyNote = (
  <p>
    <strong>Note:</strong> If you’re not sure which option to select, we
    recommend calling our Health Eligibility Center at{' '}
    <va-telephone contact={CONTACTS['222_VETS']} /> (
    <va-telephone contact={CONTACTS['711']} tty />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
    <dfn>
      <abbr title="Eastern Time">ET</abbr>
    </dfn>
    .
  </p>
);

export default RegistrationOnlyNote;
