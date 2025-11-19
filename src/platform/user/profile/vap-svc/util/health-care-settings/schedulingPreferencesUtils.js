import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { FIELD_NAMES, FIELD_TITLES } from '../../constants';

// Simple fields that can edit inline (single-select radio buttons)
const INLINE_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
  FIELD_NAMES.PROVIDER_PREFERENCE_1,
  FIELD_NAMES.PROVIDER_PREFERENCE_2,
];

// Complex fields that need subtask editing (dropdown or multi-select, complex UI)
const SUBTASK_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.CONTACT_PREFERENCE_1,
  FIELD_NAMES.CONTACT_PREFERENCE_2,
  FIELD_NAMES.APPOINTMENT_PREFERENCE_2,
];

export const isSchedulingPreference = fieldName => {
  return [
    ...INLINE_SCHEDULING_PREFERENCES,
    ...SUBTASK_SCHEDULING_PREFERENCES,
  ].includes(fieldName);
};

export const isInlineSchedulingPreference = fieldName => {
  return INLINE_SCHEDULING_PREFERENCES.includes(fieldName);
};

export const isSubtaskSchedulingPreference = fieldName => {
  return SUBTASK_SCHEDULING_PREFERENCES.includes(fieldName);
};

const schedulingPreferenceOptions = fieldname => {
  if (fieldname === FIELD_NAMES.PROVIDER_PREFERENCE_1) {
    return {
      male: 'Male',
      female: 'Female',
      noPreference: 'No preference',
    };
  }

  return {
    yes: 'Yes',
    no: 'No',
    noPreference: 'No preference',
  };
};

export const getSchedulingPreferenceInitialFormValues = (fieldname, data) => {
  // If we have data from API, use it; otherwise empty string for radio buttons
  return data ? { [fieldname]: data[fieldname] } : { [fieldname]: '' };
};

export const schedulingPreferencesUiSchema = fieldname => {
  if (!isInlineSchedulingPreference(fieldname)) {
    return { [fieldname]: {} }; // To be replaced with subtask UI schema
  }
  return {
    [fieldname]: radioUI({
      title: FIELD_TITLES[fieldname],
      labels: { ...schedulingPreferenceOptions(fieldname) },
    }),
  };
};

export const schedulingPreferencesFormSchema = fieldname => {
  if (!isInlineSchedulingPreference(fieldname)) {
    return { type: 'object', properties: {} }; // To be replaced with subtask form schema
  }
  return {
    type: 'object',
    properties: {
      [fieldname]: {
        ...radioSchema(Object.keys(schedulingPreferenceOptions(fieldname))),
      },
    },
  };
};
