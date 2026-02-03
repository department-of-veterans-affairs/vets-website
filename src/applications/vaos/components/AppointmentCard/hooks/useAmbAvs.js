import { useMemo } from 'react';
import { buildPdfObjectUrls, avsIsReady } from '../../../utils/avs';
import { AVS_ERROR_RETRIEVAL } from '../../../utils/constants';

/**
 * useAmbAvs
 * Derives ambulatory AVS PDF pairs (file + object URL) behind a feature flag.
 * Returns an empty array when flag disabled or no valid binaries.
 *
 * @param {Object} appointment Appointment resource
 * @param {boolean} featureAddOHAvs Feature flag enabling OH ambulatory AVS display
 * @returns {{ avsPairs: Array<{file: Object, url: string}>, hasValidPdfAvs: boolean, objectUrls: string[], hasRetrievalErrors: boolean }}
 */
export default function useAmbAvs(appointment, featureAddOHAvs) {
  // Filter raw ambulatory AVS entries
  const ambAvs = useMemo(
    () => {
      if (!featureAddOHAvs || !appointment?.avsPdf?.length) return [];
      return appointment?.avsPdf?.filter(avsIsReady) || [];
    },
    [featureAddOHAvs, appointment?.avsPdf],
  );

  // Check for critical retrieval errors in avsPdf array
  const hasRetrievalErrors = useMemo(
    () => {
      if (!featureAddOHAvs || !appointment?.avsPdf?.length) return false;
      return appointment.avsPdf.some(pdf => pdf?.error === AVS_ERROR_RETRIEVAL);
    },
    [featureAddOHAvs, appointment?.avsPdf],
  );

  const objectUrls = useMemo(
    () => {
      if (!featureAddOHAvs || !ambAvs.length) return [];
      return buildPdfObjectUrls(ambAvs);
    },
    [featureAddOHAvs, ambAvs],
  );

  const avsPairs = useMemo(
    () => {
      if (!featureAddOHAvs || !ambAvs.length) return [];
      return ambAvs
        .map((f, i) => ({ file: f, url: objectUrls[i] }))
        .filter(p => p.url);
    },
    [featureAddOHAvs, ambAvs, objectUrls],
  );

  return {
    avsPairs,
    hasValidPdfAvs: featureAddOHAvs && avsPairs.length > 0,
    objectUrls,
    hasRetrievalErrors,
  };
}
