import React from 'react';
import PropTypes from 'prop-types';

const phoneRegex = /\(?(\d{3})\)?[- ]*(\d{3})[- ]*(\d{4}),?(?: ?x\.? ?(\d*)?| ?ext\.? ?(\d*)?)?/i;
export const processPhoneNumber = phoneNumber => {
  const match = phoneRegex.exec(phoneNumber);
  if (!match || !match[1] || !match[2] || !match[3]) {
    // Short number or not a normal format
    return { phone: phoneNumber, ext: '', processed: false };
  }
  return {
    phone: `${match[1]}-${match[2]}-${match[3]}`,
    ext: `${match[4]?.trim() || match[5]?.trim() || ''}`,
    processed: true,
  };
};

const VAFacilityPhone = ({ phoneTitle, phoneNumber }) => {
  if (!phoneNumber) return null;
  const { phone, ext } = processPhoneNumber(phoneNumber);
  return (
    <div className="main-phone">
      {phoneTitle ? (
        <>
          <strong>{phoneTitle}: </strong>
          <va-telephone
            contact={phone}
            extension={ext || ''}
            message-aria-describedby={phoneTitle}
          />
        </>
      ) : (
        <va-telephone contact={phone} extension={ext || ''} />
      )}
    </div>
  );
};

VAFacilityPhone.propTypes = {
  phoneNumber: PropTypes.string,
  phoneTitle: PropTypes.string,
};

export default VAFacilityPhone;
