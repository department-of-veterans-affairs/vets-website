import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { parsePhoneNumber } from '../../../utils/phoneNumbers';

const Covid19PhoneLink = ({
  phone,
  showCovidVaccineSchedulingLink,
  showCovidVaccineWalkInAvailabilityText,
}) => {
  if (!phone) {
    return null;
  }

  const { number, extension } = phone;

  if (!number) {
    return null;
  }

  const { extension: parsedExtension, contact } = parsePhoneNumber(number);

  let labelText = showCovidVaccineSchedulingLink
    ? 'Or call to schedule'
    : 'Call to schedule';

  if (showCovidVaccineWalkInAvailabilityText) {
    labelText = 'Or make an appointment';
  }

  return (
    <div>
      <strong>
        {labelText}
        :&nbsp;
      </strong>
      <Telephone
        className="vads-u-margin-left--0p25"
        contact={contact}
        extension={extension || parsedExtension}
      />
    </div>
  );
};

export default Covid19PhoneLink;
