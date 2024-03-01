import React from 'react';
import PropTypes from 'prop-types';

const nonNumericReplacement = new RegExp('[^0-9\\+\\-]+', 'g');
export const processPhoneNumber = phoneNumber => {
  let phone = `${phoneNumber}`; // guaranteeing string
  let ext = '';
  if (phone.search(nonNumericReplacement) >= 0) {
    const tempPhone = phone
      .split(nonNumericReplacement)
      .map(c => c.replace(/-/g, '').trim())
      .filter(c => c);
    [phone, ext] = tempPhone;
  }
  return { phone, ext };
};

const VAFacilityPhone = ({ phoneTitle, phoneNumber }) => {
  if (!phoneNumber) return null;
  const { phone, ext } = processPhoneNumber(phoneNumber);
  return (
    <div className="main-phone">
      {phoneTitle && <strong>{phoneTitle}: </strong>}
      <va-telephone contact={phone} extension={ext || ''} />
    </div>
  );
};

VAFacilityPhone.propTypes = {
  phoneNumber: PropTypes.string,
  phoneTitle: PropTypes.string,
};

export default VAFacilityPhone;
