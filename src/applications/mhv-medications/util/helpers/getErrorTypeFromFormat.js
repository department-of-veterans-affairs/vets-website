import { PRINT_FORMAT, DOWNLOAD_FORMAT } from '../constants';

/**
 * @returns {string} The type of error based on the format.
 * 'print' for print formats, 'download' for download formats.
 */
export const getErrorTypeFromFormat = format => {
  switch (format) {
    case PRINT_FORMAT.PRINT:
    case PRINT_FORMAT.PRINT_FULL_LIST:
      return 'print';
    case DOWNLOAD_FORMAT.PDF:
    case DOWNLOAD_FORMAT.TXT:
      return 'download';
    default:
      return 'print';
  }
};
