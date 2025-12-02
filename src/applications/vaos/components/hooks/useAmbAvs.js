import { useMemo } from 'react';
import { AMBULATORY_PATIENT_SUMMARY } from '../../utils/constants';
import { buildPdfObjectUrls } from '../../utils/avs';

/**
 * useAmbAvs
 * Derives ambulatory AVS PDF pairs (file + object URL) behind a feature flag.
 * Returns an empty array when flag disabled or no valid binaries.
 *
 * @param {Object} appointment Appointment resource
 * @param {boolean} featureAddOHAvs Feature flag enabling OH ambulatory AVS display
 * @returns {{ avsPairs: Array<{file: Object, url: string}>, hasValidPdfAvs: boolean, objectUrls: string[] }}
 */
export default function useAmbAvs(appointment, featureAddOHAvs) {
  // Filter raw ambulatory AVS entries
  const ambAvs = useMemo(
    () => {
      if (!featureAddOHAvs) return [];
      return (
        appointment?.avsPdf?.filter(
          f => f?.noteType === AMBULATORY_PATIENT_SUMMARY && f?.binary,
        ) || []
      );
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
  };
}
