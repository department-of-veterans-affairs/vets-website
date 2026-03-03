import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import {
  textUI,
  textSchema,
  currentOrPastMonthYearDateRangeSchema,
  currentOrPastMonthYearDateRangeUI,
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { DoctorView, DateRangeView } from '../components/viewElements';
import { wrapRadioUiWithDl } from '../helpers/reviewHelpers';
import SafeArrayField from '../components/SafeArrayField';
import ConnectedDisabilitiesField from '../components/ConnectedDisabilitiesField';
import { extractDisabilityLabels } from '../helpers/disabilityOptions';

const doctorTypeLabels = {
  va: 'VA doctor',
  nonVa: 'Non-VA doctor',
};

const DEFAULT_DL_TITLES = {
  city: 'City',
  state: 'State',
};

const addUseDlWrap = (field, key) => {
  if (!field) {
    return field;
  }

  const updatedField = {
    ...field,
    'ui:options': {
      ...field['ui:options'],
      useDlWrap: true,
    },
  };

  if (key && DEFAULT_DL_TITLES[key] && !updatedField['ui:title']) {
    updatedField['ui:title'] = DEFAULT_DL_TITLES[key];
  }

  return updatedField;
};

const addressWithDlWrap = uiSchema =>
  Object.keys(uiSchema).reduce((acc, key) => {
    const value = uiSchema[key];
    if (key.startsWith('ui:') || key.startsWith('view:')) {
      acc[key] = value;
      return acc;
    }

    acc[key] = addUseDlWrap(value, key);
    return acc;
  }, {});

const treatmentDateSchema = {
  ...currentOrPastMonthYearDateRangeSchema,
  required: ['from'],
};

const doctorItemSchema = {
  type: 'object',
  properties: {
    doctorType: radioSchema(Object.keys(doctorTypeLabels)),
    doctorName: textSchema,
    doctorAddress: addressSchema({
      omit: ['street2', 'street3'],
    }),
    connectedDisabilities: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [],
      },
    },
    treatmentDates: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: [treatmentDateSchema],
      additionalItems: treatmentDateSchema,
    },
  },
  required: [
    'doctorType',
    'doctorName',
    'doctorAddress',
    'connectedDisabilities',
    'treatmentDates',
  ],
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Recent Medical Care',
      'Your recent medical treatment continued.',
    ),
    doctors: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Doctor',
        viewField: DoctorView,
        customTitle: 'Your doctors',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        updateSchema: (
          _fieldData,
          schema,
          _uiSchema,
          _index,
          _path,
          fullData,
        ) => {
          const disabilityOptions = extractDisabilityLabels(fullData);
          const schemaItems = Array.isArray(schema?.items)
            ? schema.items[0]
            : schema?.items;
          const connectedSchema =
            schemaItems?.properties?.connectedDisabilities;

          if (!connectedSchema) {
            return {};
          }

          const existing = connectedSchema;
          const hasOptions = disabilityOptions.length > 0;
          const updatedConnected = {
            ...existing,
            // Only require a selection when at least one disability is available
            minItems: hasOptions ? 1 : 0,
            items: {
              ...(existing.items || { type: 'string' }),
              enum: disabilityOptions,
            },
          };

          if (Array.isArray(updatedConnected.enum)) {
            delete updatedConnected.enum;
          }

          const sanitizedConnected = { ...updatedConnected };
          if ('additionalItems' in sanitizedConnected) {
            delete sanitizedConnected.additionalItems;
          }
          if (
            sanitizedConnected.items &&
            typeof sanitizedConnected.items === 'object'
          ) {
            const sanitizedItems = { ...sanitizedConnected.items };
            if (!sanitizedItems.type) {
              sanitizedItems.type = 'string';
            }
            if ('additionalItems' in sanitizedItems) {
              delete sanitizedItems.additionalItems;
            }
            sanitizedConnected.items = sanitizedItems;
          }

          const adjustRequired = requiredList => {
            if (!Array.isArray(requiredList)) {
              return requiredList;
            }
            if (hasOptions) {
              if (requiredList.includes('connectedDisabilities')) {
                return requiredList;
              }
              return [...requiredList, 'connectedDisabilities'];
            }
            const filtered = requiredList.filter(
              field => field !== 'connectedDisabilities',
            );
            return filtered.length ? filtered : undefined;
          };

          const updateItemSchema = item => {
            if (!item?.properties?.connectedDisabilities) {
              return item;
            }
            const adjustedRequired = adjustRequired(item?.required);
            const updatedItem = {
              ...item,
              properties: {
                ...item.properties,
                connectedDisabilities: sanitizedConnected,
              },
            };
            if (adjustedRequired === undefined) {
              delete updatedItem.required;
            } else if (adjustedRequired !== item?.required) {
              updatedItem.required = adjustedRequired;
            }
            return updatedItem;
          };

          if (Array.isArray(schema?.items)) {
            const updatedItems = schema.items.map(
              (item, index) => (index === 0 ? updateItemSchema(item) : item),
            );
            const result = { items: updatedItems };
            if (
              schema.additionalItems &&
              typeof schema.additionalItems === 'object'
            ) {
              result.additionalItems = updateItemSchema(schema.additionalItems);
            }
            return result;
          }

          return {
            items: updateItemSchema(schemaItems),
          };
        },
        confirmRemoveDescription:
          'Are you sure you want to remove this doctor?',
        addAnotherText: 'Add another doctor',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        doctorType: wrapRadioUiWithDl(
          radioUI({
            title: 'Doctor type',
            labels: doctorTypeLabels,
            required: () => true,
            errorMessages: {
              required: 'Please select if this is a VA or Non-VA doctor.',
            },

            // useDlWrap: true,
          }),
        ),

        doctorName: textUI({
          title: "Doctor's name",
          useDlWrap: true,
          required: () => true,
          errorMessages: {
            required: "Enter the doctor's name",
          },
        }),

        doctorAddress: {
          ...addressWithDlWrap(
            addressUI({
              labels: {
                militaryCheckbox: 'Doctor is on a military base',
              },
              omit: ['street2', 'street3'],
            }),
          ),
          required: () => true,
          // 'ui:required': () => true,
        },

        connectedDisabilities: {
          'ui:title':
            'Please select the service-connected disabilities this doctor treated you for.',
          'ui:field': ConnectedDisabilitiesField,
          'ui:required': () => true,
          'ui:errorMessages': {
            minItems:
              'Select at least one service-connected disability for this doctor',
          },
        },
        treatmentDates: {
          'ui:field': SafeArrayField,
          'ui:options': {
            itemName: 'Date',
            viewField: DateRangeView,
            customTitle: 'Your important treatment dates',
            useDlWrap: true,
            keepInPageOnReview: true,
            doNotScroll: true,
            confirmRemove: true,
            confirmRemoveDescription:
              'Are you sure you want to remove this date?',
            addAnotherText: 'Add another treatment date',
          },
          items: {
            'ui:options': {
              classNames: 'vads-u-margin-left--1p5',
            },
            ...currentOrPastMonthYearDateRangeUI(
              {
                title: 'Start date',
                hint: 'For example: January 2022',
              },
              {
                title: 'End date (if applicable)',
                hint: 'For example: January 2022',
              },
            ),
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      // Doctor and Hospital Schema
      doctors: {
        type: 'array',
        minItems: 0,
        maxItems: 10,
        items: [doctorItemSchema],
        additionalItems: doctorItemSchema,
      },
    },
  },
};
