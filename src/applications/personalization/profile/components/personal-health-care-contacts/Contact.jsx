import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  testId,
  index,
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

  return (
    <div
      data-testid={testId}
      className={classNames({ 'vads-u-margin-top--2': index > 0 })}
    >
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
  index: PropTypes.number,
  middleName: PropTypes.string,
  // postalCode: PropTypes.string,
  prefix: PropTypes.string,
  primaryPhone: PropTypes.string,
  // provinceCode: PropTypes.string,
  // relationship: PropTypes.string,
  state: PropTypes.string,
  suffix: PropTypes.string,
  testId: PropTypes.string,
  zipCode: PropTypes.string,
  // zipPlus4: PropTypes.string,
};

export default Contact;
