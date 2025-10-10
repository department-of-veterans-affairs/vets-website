import { MEDICATION_SOURCES } from '../constants';
import type { Medication, AvsData } from '../../types';

/**
 * Filters medications by their prescription type
 * @param medications - Array of medications to filter
 * @param type - The prescription type to filter by
 * @returns Filtered array of medications
 */
const filterMedicationsByType = (
  medications: Medication[],
  type: string,
): Medication[] => {
  return medications.filter(medication => medication.prescriptionType === type);
};

/**
 * Adds medication source to all medications in the array
 * @param medications - Array of medications to add source to
 * @param source - The medication source to add
 * @returns Array of medications with added source
 */
const addMedicationSource = (
  medications: Medication[],
  source: string,
): Medication[] => {
  return medications.map(medication => {
    const medicationWithSource = { ...medication };
    medicationWithSource.medicationSource = source;
    return medicationWithSource;
  });
};

/**
 * Combines VA and non-VA medications into a single array
 * @param avs - The AVS data containing medication arrays
 * @returns Combined array of all medications with sources added
 */
const getCombinedMedications = (avs: AvsData): Medication[] => {
  let combined: Medication[] = [];
  if (avs.vaMedications) {
    combined = [
      ...addMedicationSource(avs.vaMedications, MEDICATION_SOURCES.VA),
    ];
  }
  if (avs.nonvaMedications) {
    combined.push(
      ...addMedicationSource(avs.nonvaMedications, MEDICATION_SOURCES.NON_VA),
    );
  }
  return combined;
};

/**
 * Gets medications that the patient is currently taking
 * Reference for taking/not taking logic: https://dsva.slack.com/archives/C04UBETRY8N/p1701285136669219?thread_ts=1701114784.751699&cid=C04UBETRY8N
 * @param avs - The AVS data containing medication information
 * @returns Array of medications the patient is taking
 */
const getMedicationsTaking = (avs: AvsData): Medication[] => {
  const medications = getCombinedMedications(avs);
  return medications.filter(
    medication =>
      medication.patientTaking === true ||
      medication.stationNo === avs.meta.stationNo,
  );
};

/**
 * Gets medications that the patient is not currently taking
 * @param avs - The AVS data containing medication information
 * @returns Array of medications the patient is not taking
 */
const getMedicationsNotTaking = (avs: AvsData): Medication[] => {
  const medications = getCombinedMedications(avs);
  return medications.filter(
    medication =>
      medication.patientTaking === false &&
      medication.stationNo !== avs.meta.stationNo,
  );
};

export {
  addMedicationSource,
  filterMedicationsByType,
  getCombinedMedications,
  getMedicationsNotTaking,
  getMedicationsTaking,
};
