import React from 'react';

// import recordEvent from 'platform/monitoring/record-event.js';

const knownNumbers = {
  '911': ['911'],
  '8002738255': ['crisisline', 'crisis'],
  '8003331795': ['usdirect', 'direct', 'express'],
  '8005351117': ['ncacenter', 'nca'],
  '8005389552': ['dslogon', 'dmdc'],
  '8007994889': ['vetcrisistty', 'crisistty'],
  '8008271000': ['hotline', 'vabenefits', 'benefits', '1000'],
  '8008778339': ['helptty'],
  '8446982311': ['va311', '311'],
  '8552603274': ['caregiver'],
  '8555747286': ['hrc', 'reportline'],
  '8663632883': ['dslogontty', 'dmdctty'],
  '8772228387': ['helpline', 'help', '222vets'],
  '8773270022': ['mhv', 'health', 'evet'],
  '8774243838': ['4aidvet', '4aid', 'homeless'],
  '8884424551': ['gibill', 'edu'],
};

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
 * @param {string} tel - Telephone number (with or without leading "1")
 * @param {string} use - Known phone number label, e.g. "gibill"
 * @param {string} className - Additional class name to add
 * @param {string} pattern - Formatted pattern using "#" as placeholders
 * @param {string|function} label - Custom aria-label string/function
 * @param {string|function} text - Custom link text string/function
 * @param {function} onClick - Custom onClick function
 */
export default function Telephone({
  // phone number (length _must_ match the pattern; leading "1" is removed)
  tel = '',
  use = '', // quick labels for known numbers
  className = '', // additional css class to add
  pattern = '', // output format; defaults to patterns.default value
  label = '', // custom aria-label
  text = '', // custom text formatting
  onClick = recordClick,
}) {
  // "use" is for known numbers
  const useString = formatLabel(use.toString());
  const knownNumber = useString
    ? Object.keys(knownNumbers).find(number =>
        knownNumbers[number].find(lbl =>
          useString.startsWith(lbl.substring(0, 4)),
        ),
      )
    : tel.toString();

  if (useString && !knownNumber) {
    const known = Object.entries(knownNumbers).map(
      ([number, labels]) =>
        ` ${formatTelText(
          number,
          patterns[useString] || patterns.default,
        )}: ${labels.join(', ')}`,
    );
    throw new Error(
      `Telephone: "${useString}" label is not recognized; Predefined list:\n` +
        `${known.join('\n')}`,
    );
  }

  // format href: "###-### ####" => "##########"
  const number = cleanHref(knownNumber);

  const usePattern = pattern || patterns[useString] || patterns.default;
  const patternLength = usePattern.match(/#/g).length;
  const formattedTel = formatTelText(number, usePattern);

  if (!useString && (!number || number.length !== patternLength)) {
    throw new Error(
      `Telephone: "${number}" does not match the pattern (${usePattern})`,
    );
  }

  const href = number.length === 10 ? `+1${number}` : number;

  const ariaLabel =
    typeof label === 'function'
      ? label(formattedTel)
      : label || formatTelLabel(formattedTel);

  const numberText =
    typeof text === 'function'
      ? text(number, usePattern)
      : text || formattedTel;

  return (
    <a
      className={`no-wrap ${className}`}
      href={`tel:${href}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {numberText}
    </a>
  );
}
