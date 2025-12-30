import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { FIELD_NAMES, FIELD_TITLES } from '../../constants';
import {
  FIELD_ITEM_IDS,
  FIELD_OPTION_IDS,
  FIELD_OPTION_IDS_INVERTED,
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

export const schedulingPreferenceOptions = fieldName => {
  if (fieldName === FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD) {
    return FIELD_OPTION_IDS_INVERTED[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ];
  }
  if (fieldName === FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER) {
    return FIELD_OPTION_IDS_INVERTED[
      FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER
    ];
  }
  if (fieldName === FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING) {
    return FIELD_OPTION_IDS_INVERTED[FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING];
  }
  if (fieldName === FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING) {
    return FIELD_OPTION_IDS_INVERTED[
      FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING
    ];
  }

  return {};
};

export const getSchedulingPreferenceInitialFormValues = (fieldname, data) => {
  // If we have data from API, use it; otherwise empty string for radio buttons
  return data ? { [fieldname]: data[fieldname] } : { [fieldname]: '' };
};

const getSchedulingPreferenceItemId = fieldName => {
  return FIELD_ITEM_IDS[fieldName];
};

export const getSchedulingPreferencesOptionDisplayName = (
  fieldName,
  itemId,
) => {
  return FIELD_OPTION_IDS_INVERTED[fieldName]?.[itemId];
};

export const schedulingPreferencesUiSchema = fieldname => {
  if (!isInlineSchedulingPreference(fieldname)) {
    return {
      [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
        'ui:title': FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
        'ui:widget': 'select',
        'ui:required': () => true,
        'ui:options': {
          labels:
            FIELD_OPTION_IDS_INVERTED[
              FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
            ],
        },
      },
    }; // To be replaced with subtask UI schema
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
    switch (fieldname) {
      case FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
        return {
          type: 'object',
          required: [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
          properties: {
            [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
              type: 'string',
              enum: Object.keys(
                FIELD_OPTION_IDS_INVERTED[
                  FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
                ],
              ),
            },
          },
        };
      case FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
        return {
          type: 'object',
          properties: {
            [FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES]: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.keys(
                  FIELD_OPTION_IDS_INVERTED[
                    FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES
                  ],
                ),
              },
              uniqueItems: true,
            },
          },
        };
      case FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
        return {
          type: 'object',
          properties: {
            [FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.keys(
                  FIELD_OPTION_IDS_INVERTED[
                    FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES
                  ],
                ),
              },
              uniqueItems: true,
            },
          },
        };
      default:
        return {
          type: 'object',
          properties: {},
        };
    }
    // return { type: 'object', properties: {} }; // To be replaced with subtask form schema
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
  const optionIds = Object.values(data).map(value => {
    return value.replace('option-', '');
  });
  // const optionIds = getSchedulingPreferencesOptionIds(fieldName, data);
  // if we need more granular handling of option IDs, we can adjust this logic

  return { itemId, optionIds };
};

export const convertSchedulingPreferencesToReduxFormat = items => {
  const formattedData = {};

  items.preferences.forEach(item => {
    const fieldName = Object.keys(FIELD_ITEM_IDS).find(
      key => FIELD_ITEM_IDS[key] === item.itemId,
    );
    if (isInlineSchedulingPreference(fieldName)) {
      const [firstOptionId] = item.optionIds;
      formattedData[fieldName] = `option-${firstOptionId}`;
    } else {
      formattedData[fieldName] = item.optionIds.length
        ? item.optionIds.map(optionId =>
            Object.keys(FIELD_OPTION_IDS[fieldName]).find(
              key => FIELD_OPTION_IDS[fieldName][key] === optionId,
            ),
          )
        : [];
    }
  });

  return formattedData;
};
