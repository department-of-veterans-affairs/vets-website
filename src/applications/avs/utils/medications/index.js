import { MEDICATION_SOURCES } from '../constants';

const filterMedicationsByType = (medications, type) => {
  return medications.filter(medication => medication.prescriptionType === type);
};

const addMedicationSource = (medications, source) => {
  return medications.map(medication => {
    const medicationWithSource = medication;
    medicationWithSource.medicationSource = source;
    return medicationWithSource;
  });
};

const getCombinedMedications = avs => {
  let combined = [];
  if (avs.vaMedications)
    combined = [
      ...addMedicationSource(avs.vaMedications, MEDICATION_SOURCES.VA),
    ];
  if (avs.nonvaMedications)
    combined.push(
      ...addMedicationSource(avs.nonvaMedications, MEDICATION_SOURCES.NON_VA),
    );
  return combined;
};

/* reference for taking/not taking logic: https://dsva.slack.com/archives/C04UBETRY8N/p1701285136669219?thread_ts=1701114784.751699&cid=C04UBETRY8N */

const getMedicationsTaking = avs => {
  const medications = getCombinedMedications(avs);
  return medications.filter(
    medication =>
      medication.patientTaking === true ||
      medication.stationNo === avs.meta.stationNo,
  );
};

const getMedicationsNotTaking = avs => {
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
