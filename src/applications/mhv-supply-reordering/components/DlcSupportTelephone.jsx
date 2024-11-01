import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/**
 * DLC support phone number information.
 */
const DlcServiceTelephone = () => {
  return (
    <>
      <va-telephone contact="3032736200">303-273-6200</va-telephone>(
      <va-telephone contact={CONTACTS['711']} tty />)
    </>
  );
};

export default DlcServiceTelephone;
