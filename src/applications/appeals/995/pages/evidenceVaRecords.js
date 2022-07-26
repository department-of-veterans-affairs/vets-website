import dateUI from 'platform/forms-system/src/js/definitions/date';
// import { validateDateRange } from 'platform/forms-system/src/js/validation';

import LocationField from '../components/LocationField';

import { content, locationView, datesView } from '../content/evidenceVaRecords';
import { hasVAEvidence } from '../utils/helpers';
import { formatDateRange } from '../utils/dates';
import { errorMessages } from '../constants';

import { validateVALocation } from '../validations/evidence';

// const dateRange = dateRangeUI(content.dateStart, content.dateEnd);

export default {
  uiSchema: {
    'ui:description': content.page,
    'view:vaMedicalRecordsIntro': {
      'ui:title': ' ',
      'ui:description': content.intro,
      'ui:options': {
        forceDivWrapper: true,
      },
    },
    locations: {
      'ui:field': LocationField,
      'ui:title': content.locations,
      'ui:validations': [validateVALocation],
      'ui:options': {
        itemName: 'location',
        itemAriaLabel: data => data.locationAndName,
        viewField: locationView,
        updateSchema: (formData, schema) => ({
          ...schema,
          minItems: hasVAEvidence(formData) ? 1 : 0,
        }),
      },
      items: {
        'ui:options': {
          itemAriaLabel: data => data.locationAndName,
        },
        locationAndName: {
          'ui:title': content.locationAndName,
        },
        evidenceDates: {
          'ui:title': content.dates,
          'ui:field': LocationField,
          'ui:options': {
            itemName: 'date',
            itemAriaLabel: data => formatDateRange(data),
            viewField: datesView,
          },
          items: {
            'ui:errorMessages': {
              pattern: errorMessages.endDateBeforeStart,
              required: 'Please enter a date',
            },
            from: dateUI(content.dateStart),
            to: dateUI(content.dateEnd),
          },
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:vaMedicalRecordsIntro': {
        type: 'object',
        properties: {},
      },
      locations: {
        type: 'array',
        // minItems: 0, // fixes validation issue
        items: {
          type: 'object',
          required: ['locationAndName', 'evidenceDates'],
          properties: {
            locationAndName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            evidenceDates: {
              type: 'array',
              // TODO: investigate why uncommenting these out causes an
              // undefined schema error
              // minItems: 1,
              maxItems: 4,
              items: {
                type: 'object',
                required: ['from', 'to'],
                properties: {
                  from: {
                    type: 'string',
                    // pattern: '^[0-9]{4}(-[0-9]{2}){2}$',
                    // minLength: 10,
                    // maxLength: 10,
                  },
                  to: {
                    type: 'string',
                    // pattern: '^[0-9]{4}(-[0-9]{2}){2}$',
                    // minLength: 10,
                    // maxLength: 10,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
