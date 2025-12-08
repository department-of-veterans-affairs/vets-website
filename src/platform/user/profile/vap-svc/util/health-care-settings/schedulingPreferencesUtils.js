import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { FIELD_NAMES, FIELD_TITLES } from '../../constants';
import {
  FIELD_ITEM_IDS,
  FIELD_OPTION_IDS,
} from '../../constants/schedulingPreferencesConstants';

// Simple fields that can edit inline (single-select radio buttons)
const INLINE_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
  FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER,
  FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING,
];

// Complex fields that need subtask editing (dropdown or multi-select, complex UI)
const SUBTASK_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
  FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES,
  FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES,
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
  if (fieldname === FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER) {
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

const getSchedulingPreferenceItemId = fieldName => {
  return FIELD_ITEM_IDS[fieldName];
};

const getSchedulingPreferenceOptionIds = (fieldName, values) => {
  const optionIds = FIELD_OPTION_IDS[fieldName];
  const selectedValues = Object.values(values);

  return selectedValues.map(value => optionIds[value]);
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

export const schedulingPreferencesConvertCleanDataToPayload = (
  data,
  fieldName,
) => {
  const itemId = getSchedulingPreferenceItemId(fieldName);
  const optionIds = getSchedulingPreferenceOptionIds(fieldName, data);

  return { itemId, optionIds };
};
