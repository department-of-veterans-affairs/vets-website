import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { parsePhoneNumber } from '../../../utils/phoneNumbers';

const Covid19PhoneLink = ({ phone }) => {
  const { number, extension } = phone;

  if (!number) {
    return null;
  }

  const { formattedPhoneNumber, parsedExtension, contact } = parsePhoneNumber(
    number,
  );

  return (
    <div>
      <strong>Call to schedule:&nbsp;</strong>
      <Telephone
        className="vads-u-margin-left--0p25"
        contact={contact}
        extension={extension || parsedExtension}
      >
        {formattedPhoneNumber}
      </Telephone>
    </div>
  );
};

export default Covid19PhoneLink;
