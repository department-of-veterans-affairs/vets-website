import {
  getSeiActivityJournal,
  getSeiAllergies,
  getSeiEmergencyContacts,
  getSeiFamilyHistory,
  getSeiFoodJournal,
  getSeiProviders,
  getSeiHealthInsurance,
  getSeiTestEntries,
  getSeiMedicalEvents,
  getSeiMedications,
  getSeiMilitaryHistory,
  getSeiTreatmentFacilities,
  getSeiVaccines,
  getSeiVitalSigns,
  getSelfEnteredInformation,
  getPatient,
} from './sei-api';

export const getAllSelfEnteredData = () => {
  return getSelfEnteredInformation();
};

export const getSelfEnteredData = () => {
  const fetchMap = {
    activityJournal: getSeiActivityJournal,
    allergies: getSeiAllergies,
    demographics: getPatient,
    emergencyContacts: getSeiEmergencyContacts,
    familyHistory: getSeiFamilyHistory,
    foodJournal: getSeiFoodJournal,
    providers: getSeiProviders,
    healthInsurance: getSeiHealthInsurance,
    testEntries: getSeiTestEntries,
    medicalEvents: getSeiMedicalEvents,
    medications: getSeiMedications,
    militaryHistory: getSeiMilitaryHistory,
    treatmentFacilities: getSeiTreatmentFacilities,
    vaccines: getSeiVaccines,
    vitals: getSeiVitalSigns,
  };

  const promises = Object.entries(fetchMap).map(([key, fetchFn]) =>
    fetchFn()
      .then(response => ({ key, response }))
      .catch(error => {
        const newError = new Error(error);
        newError.key = key;
        throw newError;
      }),
  );

  return Promise.allSettled(promises);
};
