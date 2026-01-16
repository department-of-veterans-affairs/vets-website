import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import { treatmentView } from '../content/vaMedicalRecords';
import { hasVAEvidence } from '../utils';
import { makeSchemaForAllDisabilities } from '../utils/schemas';
import { isCompletingForm0781 } from '../utils/form0781';
import { standardTitle } from '../content/form0781';
import { formatDate } from '../utils/dates';

import {
  validateMilitaryTreatmentCity,
  validateMilitaryTreatmentState,
  startedAfterServicePeriod,
  validateBooleanGroup,
} from '../validations';
import { USA } from '../constants';

const { vaTreatmentFacilities } = fullSchema.properties;

export const uiSchema = {
  'view:vaMedicalRecordsIntro': {
    'ui:title': standardTitle('Request medical records from VA providers'),
    'ui:description':
      'Tell us where VA treated you for your condition. We’ll use the information you provide to help us locate your records and make decisions on your claim.',
  },
  vaTreatmentFacilities: {
    'ui:options': {
      itemName: 'Facility',
      itemAriaLabel: data => data.treatmentCenterName,
      viewField: treatmentView,
      showSave: true,
      reviewMode: true,
      confirmRemove: true,
      updateSchema: (formData, schema) => ({
        ...schema,
        minItems: hasVAEvidence(formData) ? 1 : 0,
      }),
    },
    items: {
      'ui:order': [
        'treatmentCenterName',
        'treatedDisabilityNames',
        'treatmentLocation0781Related',
        'treatmentDateRange',
        'treatmentCenterAddress',
      ],
      'ui:options': {
        itemAriaLabel: data => data.treatmentCenterName,
      },
      treatmentCenterName: {
        'ui:title': 'Name of VA medical facility',
      },
      treatedDisabilityNames: {
        'ui:title':
          'Choose the conditions you got treatment for at this facility.',
        'ui:webComponentField': VaCheckboxGroupField,
        'ui:options': {
          updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition',
          required: 'Please select at least one condition',
        },
      },
      treatmentLocation0781Related: {
        ...yesNoUI({
          title:
            'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        }),
        'ui:options': {
          hideIf: formData => !isCompletingForm0781(formData),
        },
        'ui:required': formData => isCompletingForm0781(formData),
        'ui:confirmationField': value => {
          return {
            data: value.formData ? 'Yes' : 'No',
            label:
              'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
          };
        },
      },
      treatmentDateRange: {
        from: {
          ...dateUI('When did you first visit this facility?'),
          'ui:validations': dateUI()['ui:validations'].concat([
            startedAfterServicePeriod,
          ]),
          'ui:confirmationField': value => {
            if (
              typeof value.formData !== 'string' ||
              !value.formData ||
              value.formData === ''
            ) {
              return {
                data: 'Unknown',
                label: 'When did you first visit this facility?',
              };
            }

            const [year, month, day] = value.formData.split('-');

            if (year === 'XXXX') {
              return {
                data: 'Unknown',
                label: 'When did you first visit this facility?',
              };
            }

            let formattedDate = 'Unknown';

            if (month === 'XX') {
              // Year only: 2015-XX-XX → "2015"
              formattedDate = year;
            } else if (day === 'XX') {
              // Month/Year: 2015-12-XX → "December 2015"
              const monthYear = formatDate(`${year}-${month}-01`, 'MMMM yyyy');
              formattedDate =
                monthYear && monthYear !== 'Invalid date'
                  ? monthYear
                  : 'Unknown';
            } else {
              // Full date: 2015-12-10 → "December 10, 2015"
              const fullDate = formatDate(
                `${year}-${month}-${day}`,
                'MMMM D, YYYY',
              );
              formattedDate =
                fullDate && fullDate !== 'Invalid date' ? fullDate : 'Unknown';
            }

            return {
              data: formattedDate,
              label: 'When did you first visit this facility?',
            };
          },
        },
      },
      treatmentCenterAddress: {
        'ui:order': ['country', 'state', 'city'],
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
          'ui:validations': [validateMilitaryTreatmentState],
          'ui:options': {
            expandUnder: 'country',
            expandUnderCondition: USA,
          },
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
          'ui:validations': [validateMilitaryTreatmentCity],
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:vaMedicalRecordsIntro': {
      type: 'object',
      properties: {},
    },
    vaTreatmentFacilities: {
      ...vaTreatmentFacilities,
      minItems: 0, // fixes validation issue
      items: {
        type: 'object',
        required: ['treatmentCenterName', 'treatedDisabilityNames'],
        properties: {
          treatmentCenterName:
            vaTreatmentFacilities.items.properties.treatmentCenterName,
          treatmentLocation0781Related: {
            type: 'boolean',
            properties: {},
          },
          treatmentDateRange: {
            type: 'object',
            properties: {
              from: {
                $ref: '#/definitions/date',
              },
            },
          },
          treatmentCenterAddress:
            vaTreatmentFacilities.items.properties.treatmentCenterAddress,
          treatedDisabilityNames: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
