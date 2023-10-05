import React from 'react';
import PropTypes from 'prop-types';

// modeled after VA Profile's Health Benefit AssociatedPersonBio

const Contact = ({
  contactType,
  prefix,
  givenName,
  middleName,
  familyName,
  suffix,
  // relationship,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  state,
  // county,
  zipCode,
  // zipPlus4,
  // postalCode,
  // provinceCode,
  // country,
  primaryPhone,
  // alternatePhone,
}) => {
  const names = [prefix, givenName, middleName, familyName, suffix];
  const name = names.filter(el => !!el).join(' ');
  const addressLine4 = `${city}, ${state} ${zipCode}`;
  const addressLines = [
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
  ].filter(line => !!line);
  const showAddress = contactType.match(/next of kin/i);

  if (!givenName && !familyName && !primaryPhone) {
    return (
      <div>
        To add an emergency contact or next of kin please call the Help Desk at{' '}
        <va-telephone contact="8006982411" />
      </div>
    );
  }

  return (
    <div>
      {name}
      <br />
      {showAddress &&
        addressLines.length >= 2 &&
        addressLines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      {primaryPhone}
    </div>
  );
};

Contact.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  // alternatePhone: PropTypes.string,
  city: PropTypes.string,
  contactType: PropTypes.string,
  // country: PropTypes.string,
  // county: PropTypes.string,
  familyName: PropTypes.string,
  givenName: PropTypes.string,
  middleName: PropTypes.string,
  // postalCode: PropTypes.string,
  prefix: PropTypes.string,
  primaryPhone: PropTypes.string,
  // provinceCode: PropTypes.string,
  // relationship: PropTypes.string,
  state: PropTypes.string,
  suffix: PropTypes.string,
  zipCode: PropTypes.string,
  // zipPlus4: PropTypes.string,
};

export default Contact;
