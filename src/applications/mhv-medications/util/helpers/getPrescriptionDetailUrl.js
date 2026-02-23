import { STATION_NUMBER_PARAM } from '../constants';

/**
 * Build the URL for prescription detail pages
 * @param {Object} prescription - The prescription object
 * @param {string|number} prescription.prescriptionId - The prescription ID
 * @param {string} [prescription.stationNumber] - The station number (used for v2 API)
 * @param {string} [suffix] - Optional URL suffix (e.g., '/documentation')
 * @returns {string} The URL path with optional station_number query param
 */
export const getPrescriptionDetailUrl = (prescription, suffix = '') => {
  const { prescriptionId, stationNumber } = prescription || {};

  if (!prescriptionId) {
    return '';
  }

  const basePath = `/prescription/${prescriptionId}${suffix}`;

  if (stationNumber) {
    return `${basePath}?${STATION_NUMBER_PARAM}=${stationNumber}`;
  }

  return basePath;
};
