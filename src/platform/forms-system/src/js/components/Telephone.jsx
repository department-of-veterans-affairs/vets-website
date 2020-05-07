import React from 'react';

// import recordEvent from 'platform/monitoring/record-event.js';

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

const patterns = {
  '911': '###',
  default: '###-###-####',
};

const recordClick = () => {
  // TO-DO: pass event name & location URL
  // recordEvent({ event: `telephone-click` });
};

// Allow labels "gi-bill", "GI_Bill" or "GI BILL"
const formatLabel = label => label?.replace(/[-_\s]/g, '').toLowerCase();

// Strip out leading "1" and any non-digits
const cleanHref = number =>
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

/**
 * Produce a standardized accessible telephone link
 * @param {string} contact - Known phone number label; from CONTACTS, or pass a
 *  telephone number with or without leading "1" (it gets stripped off)
 * @param {string} className - Additional class name to add
 * @param {string} pattern - Formatted pattern using "#" as placeholders
 * @param {string|function} ariaLabel - Custom aria-label string
 * @param {function} onClick - Custom onClick function
 */
export default function Telephone({
  // phone number (length _must_ match the pattern; leading "1" is removed)
  contact = '', // telephone number
  className = '', // additional css class to add
  pattern = '', // output format; defaults to patterns.default value
  ariaLabel = '', // custom aria-label
  onClick = recordClick,
  children,
}) {
  const contactString = formatLabel(contact.toString());
  const rawNumber = CONTACTS[contactString] || contactString;

  // strip out non-digits for use in href: "###-### ####" => "##########"
  const cleanNumber = cleanHref(rawNumber);

  const contactPattern = pattern || patterns[contactString] || patterns.default;
  const patternLength = contactPattern.match(/#/g).length;
  const formattedTel = formatTelText(cleanNumber, contactPattern);

  if (!cleanNumber || cleanNumber.length !== patternLength) {
    throw new Error(
      `Telephone: "${cleanNumber}" does not match the pattern (${contactPattern})`,
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
