let REPRESENTATIVES_API_PATH =
  '/representation_management/v0/original_entities';

export const getRepresentativesApi = () => REPRESENTATIVES_API_PATH;

export const setRepresentativesApiFromFlag = enabled => {
  REPRESENTATIVES_API_PATH = enabled
    ? '/representation_management/v0/accredited_entities_for_appoint'
    : '/representation_management/v0/original_entities';
};

export const NEXT_STEPS_EMAIL_API =
  '/representation_management/v0/next_steps_email';

export const REPRESENTATIVE_STATUS_API =
  '/representation_management/v0/power_of_attorney';
