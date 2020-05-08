import React from 'react';
import PropTypes from 'prop-types';

export const CONTACTS = Object.freeze({
  '222_VETS': '8772228387', // VA Help Line
  '4AID_VET': '8774243838', // National Call Center for Homeless Veterans
  911: '911',
  CAREGIVER: '8552603274', // VA National Caregiver Support Line
  CRISIS_LINE: '8002738255', // Veterans Crisis hotline
  CRISIS_TTY: '8007994889', // Veterans Crisis hotline TTY
  DS_LOGON: '8005389552', // Defense Manpower Data Center
  DS_LOGON_TTY: '8663632883', // Defense Manpower Data Center TTY
  GI_BILL: '8884424551', // Education Call Center (1-888-GI-BILL-1)
  GO_DIRECT: '8003331795', // Go Direct/Direct Express (Treasury)
  HELP_DESK: '8555747286', // VA Help desk
  HELP_TTY: '8008778339', // VA Help Desk TTY
  MY_HEALTHEVET: '8773270022', // My HealtheVet help desk
  NCA: '8005351117', // National Cemetery Scheduling Office
  TESC: '8882242950', // U.S. Treasury Electronic Payment Solution Center
  VA_311: '8446982311', // VA Help desk (VA311)
  VA_BENEFITS: '8008271000', // Veterans Benefits Assistance
});

export const PATTERNS = {
  911: '###', // needed to match 911 CONTACT
  DEFAULT: '###-###-####',
  WRAP_AREACODE: '(###) ###-####',
};

// Strip out leading "1" and any non-digits
const parseNumber = number =>
  number
    .replace(/^1/, '') // strip leading "1" from telephone number
    .replace(/[^\d]/g, '');

// Create link text from pattern
const formatTelText = (num, pattern) => {
  let i = 0;
  return pattern.replace(/#/g, () => num[i++] || '');
};

const formatBlock = number => {
  const len = number.length - 1;
  // return rounded number as a grouped value, e.g. `800` or `1000`
  // but split non-round numbers, e.g. `827` => `8 2 7`
  const roundNumber = parseInt(number.slice(-len), 10) === 0;
  return roundNumber ? number : number.split('').join(' ');
};

// Combine phone number blocks within the label separated by periods
// "800-555-1212" => "800. 5 5 5. 1 2 1 2"
const formatTelLabel = number =>
  number
    .split(/[^\d]+/)
    .filter(n => n)
    .map(formatBlock)
    .join('. ');

function Telephone({
  // phone number (length _must_ match the pattern; leading "1" is removed)
  contact = '', // telephone number
  className = '', // additional css class to add
  pattern = '', // output format; defaults to patterns.default value
  ariaLabel = '', // custom aria-label
  onClick = () => {},
  children,
}) {
  // strip out non-digits for use in href: "###-### ####" => "##########"
  const contactString = parseNumber(contact.toString());
  const cleanNumber = CONTACTS[contactString] || contactString;

  // Capture "911" pattern here
  const contactPattern = pattern || PATTERNS[contactString] || PATTERNS.DEFAULT;
  const patternLength = contactPattern.match(/#/g).length;
  const formattedTel = formatTelText(cleanNumber, contactPattern);

  if (!cleanNumber || cleanNumber.length !== patternLength) {
    throw new Error(
      `Contact number "${cleanNumber}" does not match the pattern (${contactPattern})`,
    );
  }

  const href = cleanNumber.length === 10 ? `+1${cleanNumber}` : cleanNumber;

  return (
    <a
      className={`no-wrap ${className}`}
      href={`tel:${href}`}
      aria-label={ariaLabel || formatTelLabel(formattedTel)}
      onClick={onClick}
    >
      {children || formattedTel}
    </a>
  );
}

Telephone.propTypes = {
  /**
   * Pass a telephone number, or use a known phone number in CONTACTS. Any
   * number with a leading "1" will be stripped off (assuming country code).
   * Whitespace and non-digits will be stripped out of this string.
   */
  contact: PropTypes.string.isRequired,

  /**
   * Additional class name to add to the link.
   */
  className: PropTypes.string,

  /**
   * Pattern use used while formatting the contact number. Use provided
   * PATTERNS, or create a custom one using "#" as a placeholder for each
   * number. Note that the number of "#"'s in the pattern <em>must</em> equal
   * the contact number length or an error is thrown.
   */
  pattern: PropTypes.string,

  /**
   * Custom aria-label string.
   */
  ariaLabel: PropTypes.string,

  /**
   * Custom onClick function
   */
  onClick: PropTypes.func,
};

export default Telephone;
