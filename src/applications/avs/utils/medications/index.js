const filterMedicationsByType = (medications, type) => {
  return medications.filter(medication => medication.prescriptionType === type);
};

const getCombinedMedications = avs => {
  const combined = avs.vaMedications;
  combined.push(...avs.nonvaMedications);
  return combined;
};

export { filterMedicationsByType, getCombinedMedications };
