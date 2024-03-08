import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

// modeled after VA Profile's Health Benefit AssociatedPersonBio

const CONTACT_TYPES = [
  'Emergency Contact',
  'Other emergency contact',
  'Primary Next of Kin',
  'Other Next of Kin',
];

const DESCRIPTIONS = {
  [CONTACT_TYPES[0]]: 'The person we’ll contact first in an emergency.',
  [CONTACT_TYPES[1]]:
    'The person we’ll if your primary contact isn’t available.',
  [CONTACT_TYPES[2]]:
    'The person you want to represent your health care wishes if needed.',
  [CONTACT_TYPES[3]]:
    'The person you want to represent your health care wishes if needed.',
};

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
  numberOfContacts,
}) => {
  const names = [prefix, givenName, middleName, familyName, suffix];
  const name = names.filter(el => !!el).join(' ');
  const addressLine4 = [city, ', ', state, ' ', zipCode]
    .filter(el => !!el)
    .join('');
  const addressLines = [
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
  ].filter(line => !!line);

  const isNextOfKin = contactType.match(/next of kin/i);
  const baseContactType = contactType.replace(/^(primary\s+|other\s+)/i, '');
  let title = '';
  if (numberOfContacts > 1) {
    title = index === 0 ? 'Primary ' : 'Secondary ';
  }
  title = capitalize(`${title}${baseContactType}`);

  const description = DESCRIPTIONS[contactType];

  return (
    <div data-testid={testId}>
      {numberOfContacts > 1 && (
        <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-margin--0">
          {title}
        </h3>
      )}
      <p className="vads-u-color--gray-medium vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
        {description}
      </p>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--1">
        {name}
        <br />
        {isNextOfKin &&
          addressLines.length >= 2 &&
          addressLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        <va-telephone contact={primaryPhone} not-clickable />
      </p>
    </div>
  );
};

Contact.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  // alternatePhone: PropTypes.string,
  city: PropTypes.string,
  contactType: PropTypes.oneOf(CONTACT_TYPES),
  // country: PropTypes.string,
  // county: PropTypes.string,
  familyName: PropTypes.string,
  givenName: PropTypes.string,
  index: PropTypes.number,
  middleName: PropTypes.string,
  numberOfContacts: PropTypes.number,
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
