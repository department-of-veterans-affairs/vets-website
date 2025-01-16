import React from 'react';

/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored - Thing to be displayed
 *        visually, but ignored by screen readers
 * @param {String} substitutionText - Text for screen readers to say instead of
 *        srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export default function mask(string, unmaskedLength) {
  // If no string is given, tell the screen reader users the account or routing number is blank
  if (!string) {
    return srSubstitute('', 'is blank');
  }
  const repeatCount =
    string.length > unmaskedLength ? string.length - unmaskedLength : 0;
  const maskedString = srSubstitute(
    `${'●'.repeat(repeatCount)}`,
    'ending with',
  );
  return (
    <span>
      {maskedString}
      {string.slice(-unmaskedLength)}
    </span>
  );
}

/**
 * Format a number with spaces between digits for screen readers while maintaining
 * visual display without spaces.
 *
 * @param {string|number} number - The number to format
 * @returns {ReactElement} - Formatted number with screen reader spacing
 */
export const formatNumberForScreenReader = number => {
  if (!number && number !== 0) return null;

  const numberString = number.toString();
  const visualDisplay = numberString;
  const screenReaderText = numberString.split('').join(' ');

  return srSubstitute(visualDisplay, screenReaderText);
};
