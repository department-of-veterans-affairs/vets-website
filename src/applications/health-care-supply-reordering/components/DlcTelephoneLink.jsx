import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { DLC_PHONE } from '../constants';

const DlcTelephoneLink = () => (
  <>
    <va-telephone contact={DLC_PHONE} /> (
    <va-telephone contact={CONTACTS['711']} tty />)
  </>
);

export default DlcTelephoneLink;
