import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

export const getSeiVitalSigns = () => {
  return apiRequest(`${apiBasePath}/medical_records/self_entered/vitals`, {
    headers,
  });
};

export const getSeiAllergies = () => {
  return apiRequest(`${apiBasePath}/medical_records/self_entered/allergies`, {
    headers,
  });
};

export const getSeiFamilyHistory = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/family_history`,
    { headers },
  );
};

export const getSeiVaccines = () => {
  return apiRequest(`${apiBasePath}/medical_records/self_entered/vaccines`, {
    headers,
  });
};

export const getSeiTestEntries = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/test_entries`,
    { headers },
  );
};

export const getSeiMedicalEvents = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/medical_events`,
    { headers },
  );
};

export const getSeiMilitaryHistory = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/military_history`,
    { headers },
  );
};

export const getSeiProviders = () => {
  return apiRequest(`${apiBasePath}/medical_records/self_entered/providers`, {
    headers,
  });
};

export const getSeiHealthInsurance = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/health_insurance`,
    { headers },
  );
};

export const getSeiTreatmentFacilities = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/treatment_facilities`,
    { headers },
  );
};

export const getSeiFoodJournal = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/food_journal`,
    { headers },
  );
};

export const getSeiActivityJournal = () => {
  return apiRequest(
    `${apiBasePath}/medical_records/self_entered/activity_journal`,
    { headers },
  );
};

export const getSeiMedications = () => {
  return apiRequest(`${apiBasePath}/medical_records/self_entered/medications`, {
    headers,
  });
};
