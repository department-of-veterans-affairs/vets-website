import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import moment from 'moment';
import { createSelector } from 'reselect';
import { isFullDate } from 'platform/forms/validations';

import fullNameUI from 'platform/forms/definitions/fullName';
import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';

const {
  combatSince911,
  placeOfSeparation,
  previousNames,
} = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:serveUnderOtherNames': {
      'ui:title': 'Did you serve under another name?',
      'ui:widget': 'yesNo',
    },
    previousNames: {
      'ui:options': {
        itemName: 'Name',
        expandUnder: 'view:serveUnderOtherNames',
        viewField: FullNameField,
        reviewTitle: 'Previous names',
      },
      items: fullNameUI,
    },
    placeOfSeparation: {
      'ui:title':
        'Place of last or anticipated separation (city and state or foreign country)',
    },
    combatSince911: (() => {
      const rangeExcludes911 = createSelector(
        form => form.servicePeriods,
        periods =>
          (periods || []).every(
            period =>
              !period.activeServiceDateRange ||
              !isFullDate(period.activeServiceDateRange.to) ||
              !moment('2001-09-11').isBefore(period.activeServiceDateRange.to),
          ),
      );

      return {
        'ui:title': 'Did you serve in a combat zone after 9/11/2001?',
        'ui:widget': 'yesNo',
        'ui:required': formData => !rangeExcludes911(formData),
        'ui:options': {
          hideIf: rangeExcludes911,
        },
      };
    })(),
  },
  schema: {
    type: 'object',
    required: ['view:serveUnderOtherNames'],
    properties: {
      'view:serveUnderOtherNames': {
        type: 'boolean',
      },
      previousNames: {
        ...previousNames,
        minItems: 1,
      },
      placeOfSeparation,
      combatSince911,
    },
  },
};
