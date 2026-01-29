import { DATETIME_FORMATS } from '../constants';
import { dateFormat } from './dateFormat';

/**
 * Generates a timestamp to be included in a filename. This timestamp is localized
 * to the 'America/New_York' timezone and formatted as a dashed date with a non-punctuated
 * time string.
 * (example: 03:04:56am on 01-01-2025 => 1-1-2025_30456am)
 * @returns {string} a formatted timestamp to be included in filenames.
 */
export const generateTimestampForFilename = () =>
  dateFormat(
    Date.now(),
    DATETIME_FORMATS.filename,
    null,
    null,
    'America/New_York',
  ).replace(/\./g, '');
