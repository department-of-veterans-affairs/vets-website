const filterMedicationsByType = (medications, type) => {
  return medications.filter(medication => medication.prescriptionType === type);
};

const getCombinedMedications = avs => {
  const combined = [...avs.vaMedications];
  combined.push(...avs.nonvaMedications);
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
  filterMedicationsByType,
  getCombinedMedications,
  getMedicationsNotTaking,
  getMedicationsTaking,
};
