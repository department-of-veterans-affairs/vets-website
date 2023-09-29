import React from 'react';

const Contact = ({
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

  if (!givenName && !familyName && !primaryPhone) {
    return (
      <div>
        To add an emergency contact or next of kin please call the Help Desk at
        {' '}
        <va-telephone contact="8006982411" />
      </div>
    );
  }

  return (
    <div>
      {name}
      <br />
      {addressLines.length >= 2 &&
        addressLines.map(line => (
          <>
            {line}
            <br />
          </>
        ))}
      {primaryPhone}
    </div>
  );
};

export default Contact;
