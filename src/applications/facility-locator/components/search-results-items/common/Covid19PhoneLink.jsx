import React from 'react';
import { parsePhoneNumber } from '../../../utils/phoneNumbers';

const Covid19PhoneLink = ({
  phone,
  showCovidVaccineWalkInAvailabilityText,
  labelId,
}) => {
  if (!phone) {
    return null;
  }

  const { number, extension } = phone;

  if (!number) {
    return null;
  }

  const { extension: parsedExtension, contact } = parsePhoneNumber(number);

  let labelText = 'Call to schedule';

  if (showCovidVaccineWalkInAvailabilityText) {
    labelText = 'Or make an appointment';
  }

  return (
    <div>
      <strong id={labelId}>
        {labelText}
        :&nbsp;
      </strong>
      <va-telephone
        className="vads-u-margin-left--0p25"
        contact={contact}
        extension={extension || parsedExtension}
        aria-describedby={labelId}
        message-aria-describedby={labelText}
      />
    </div>
  );
};

export default Covid19PhoneLink;
