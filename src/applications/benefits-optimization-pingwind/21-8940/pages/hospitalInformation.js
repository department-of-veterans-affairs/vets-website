import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';

import {
  textUI,
  textSchema,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { HospitalView, DateRangeView } from '../components/viewElements';
import SafeArrayField from '../components/SafeArrayField';
import ConnectedDisabilitiesField from '../components/ConnectedDisabilitiesField';
import { extractDisabilityLabels } from '../helpers/disabilityOptions';

const hospitalTypeLabels = {
  va: 'VA Hospital',
  nonVa: 'Non-VA Hospital',
};

const treatmentDateSchema = {
  type: 'object',
  properties: {
    startDate: currentOrPastMonthYearDateSchema,
    endDate: currentOrPastMonthYearDateSchema,
  },
  required: ['startDate'],
};

const hospitalItemSchema = {
  type: 'object',
  properties: {
    hospitalType: radioSchema(Object.keys(hospitalTypeLabels)),
    hospitalName: textSchema,
    hospitalAddress: addressSchema({ omit: ['street2', 'street3'] }),
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
      minItems: 0,
      maxItems: 10,
      items: [treatmentDateSchema],
      additionalItems: treatmentDateSchema,
    },
  },
  required: [
    'hospitalType',
    'hospitalName',
    'hospitalAddress',
    'connectedDisabilities',
  ],
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Hospital Information',
      'Please provide information about your hospital stays and treatment dates',
    ),
    hospitals: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalView,
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this hospital?',
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
              return requiredList.includes('connectedDisabilities')
                ? requiredList
                : [...requiredList, 'connectedDisabilities'];
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
            } else {
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
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        hospitalType: {
          ...radioUI({
            title: 'Hospital type',
            labels: hospitalTypeLabels,
            required: () => true,
            errorMessages: {
              required: 'Please select if this is a VA or Non-VA hospital.',
            },
            tile: true,
            useDlWrap: true,
          }),
        },
        hospitalName: {
          ...textUI('Hospital name'),
          'ui:errorMessages': {
            required: 'Enter the hospital name',
          },
          'ui:required': () => true,
        },
        hospitalAddress: {
          ...addressUI({
            labels: {
              militaryCheckbox: 'Hospital is on a military base',
            },
            omit: ['street2', 'street3'],
          }),
          'ui:required': () => true,
        },
        connectedDisabilities: {
          'ui:title':
            'Please select your service-connected disabilities for this hospitalization.',
          'ui:field': ConnectedDisabilitiesField,
          'ui:required': () => true,
          'ui:errorMessages': {
            minItems:
              'Select at least one service-connected disability for this hospitalization',
          },
        },
        treatmentDates: {
          'ui:field': SafeArrayField,
          'ui:options': {
            itemName: 'Treatment Date',
            viewField: DateRangeView,
            customTitle: 'Your important treatment dates',
            useDlWrap: true,
            keepInPageOnReview: true,
            doNotScroll: true,
            confirmRemove: true,
            confirmRemoveDescription:
              'Are you sure you want to remove this treatment date?',
            addAnotherText: 'Add another treatment date',
          },
          items: {
            'ui:options': {
              classNames: 'vads-u-margin-left--1p5',
            },
            startDate: {
              ...currentOrPastMonthYearDateUI({
                title: 'Start date of treatment',
                hint: 'For example: January 19 2022',
              }),
              'ui:required': () => true,
            },
            endDate: {
              ...currentOrPastMonthYearDateUI({
                title: 'End date of treatment (if applicable)',
                hint: 'For example: January 19 2022',
              }),
            },
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hospitals: {
        type: 'array',
        minItems: 0,
        maxItems: 10,
        items: [hospitalItemSchema],
        additionalItems: hospitalItemSchema,
      },
    },
  },
};
